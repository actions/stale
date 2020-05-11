import * as core from '@actions/core';
import * as github from '@actions/github';
import {Octokit} from '@octokit/rest';

type OctoKitIssueList = Octokit.Response<Octokit.IssuesListForRepoResponse>;

export interface Issue {
  title: string;
  number: number;
  updated_at: string;
  labels: Label[];
  pull_request: any;
  state: string;
  locked: boolean;
}

export interface User {
  type: string;
}

export interface Comment {
  user: User;
}

export interface IssueEvent {
  created_at: string;
  event: string;
  label: Label;
}

export interface Label {
  name: string;
}

export interface IssueProcessorOptions {
  repoToken: string;
  staleIssueMessage: string;
  stalePrMessage: string;
  daysBeforeStale: number;
  daysBeforeClose: number;
  staleIssueLabel: string;
  exemptIssueLabels: string;
  stalePrLabel: string;
  exemptPrLabels: string;
  onlyLabels: string;
  operationsPerRun: number;
  removeStaleWhenUpdated: boolean;
  debugOnly: boolean;
}

/***
 * Handle processing of issues for staleness/closure.
 */
export class IssueProcessor {
  readonly client: github.GitHub;
  readonly options: IssueProcessorOptions;
  private operationsLeft: number = 0;

  readonly staleIssues: Issue[] = [];
  readonly closedIssues: Issue[] = [];
  readonly removedLabelIssues: Issue[] = [];

  constructor(
    options: IssueProcessorOptions,
    getIssues?: (page: number) => Promise<Issue[]>,
    listIssueComments?: (
      issueNumber: number,
      sinceDate: string
    ) => Promise<Comment[]>,
    getLabelCreationDate?: (issue: Issue, label: string) => Promise<string>
  ) {
    this.options = options;
    this.operationsLeft = options.operationsPerRun;
    this.client = new github.GitHub(options.repoToken);

    if (getIssues) {
      this.getIssues = getIssues;
    }

    if (listIssueComments) {
      this.listIssueComments = listIssueComments;
    }

    if (getLabelCreationDate) {
      this.getLabelCreationDate = getLabelCreationDate;
    }

    if (this.options.debugOnly) {
      core.warning(
        'Executing in debug mode. Debug output will be written but no issues will be processed.'
      );
    }
  }

  async processIssues(page: number = 1): Promise<number> {
    if (this.operationsLeft <= 0) {
      core.warning('Reached max number of operations to process. Exiting.');
      return 0;
    }

    // get the next batch of issues
    const issues: Issue[] = await this.getIssues(page);
    this.operationsLeft -= 1;

    if (issues.length <= 0) {
      core.debug('No more issues found to process. Exiting.');
      return this.operationsLeft;
    }

    for (const issue of issues.values()) {
      const isPr = !!issue.pull_request;

      core.debug(
        `Found issue: issue #${issue.number} - ${issue.title} last updated ${issue.updated_at} (is pr? ${isPr})`
      );

      // calculate string based messages for this issue
      const staleMessage: string = isPr
        ? this.options.stalePrMessage
        : this.options.staleIssueMessage;
      const staleLabel: string = isPr
        ? this.options.stalePrLabel
        : this.options.staleIssueLabel;
      const exemptLabels = IssueProcessor.parseCommaSeparatedString(
        isPr ? this.options.exemptPrLabels : this.options.exemptIssueLabels
      );
      const issueType: string = isPr ? 'pr' : 'issue';

      if (!staleMessage) {
        core.debug(`Skipping ${issueType} due to empty stale message`);
        continue;
      }

      if (issue.state === 'closed') {
        core.debug(`Skipping ${issueType} because it is closed`);
        continue; // don't process closed issues
      }

      if (issue.locked) {
        core.debug(`Skipping ${issueType} because it is locked`);
        continue; // don't process locked issues
      }

      if (
        exemptLabels.some((exemptLabel: string) =>
          IssueProcessor.isLabeled(issue, exemptLabel)
        )
      ) {
        core.debug(`Skipping ${issueType} because it has an exempt label`);
        continue; // don't process exempt issues
      }

      // does this issue have a stale label?
      let isStale = IssueProcessor.isLabeled(issue, staleLabel);

      // determine if this issue needs to be marked stale first
      if (
        !isStale &&
        !IssueProcessor.updatedSince(
          issue.updated_at,
          this.options.daysBeforeStale
        )
      ) {
        core.debug(
          `Marking ${issueType} stale because it was last updated on ${issue.updated_at} and it does not have a stale label`
        );
        await this.markStale(issue, staleMessage, staleLabel);
        this.operationsLeft -= 2;
        isStale = true; // this issue is now considered stale
      }

      // process any issues marked stale (including the issue above, if it was marked)
      if (isStale) {
        core.debug(`Found a stale ${issueType}`);
        await this.processStaleIssue(issue, issueType, staleLabel);
      }
    }

    // do the next batch
    return this.processIssues(page + 1);
  }

  // handle all of the stale issue logic when we find a stale issue
  private async processStaleIssue(
    issue: Issue,
    issueType: string,
    staleLabel: string
  ) {
    if (this.options.daysBeforeClose < 0) {
      return; // nothing to do because we aren't closing stale issues
    }

    const markedStaleOn: string = await this.getLabelCreationDate(
      issue,
      staleLabel
    );
    const issueHasComments: boolean = await this.isIssueStillStale(
      issue,
      markedStaleOn
    );

    const issueHasUpdate: boolean = IssueProcessor.updatedSince(
      issue.updated_at,
      this.options.daysBeforeClose
    );

    core.debug(`Issue #${issue.number} marked stale on: ${markedStaleOn}`);
    core.debug(`Issue #${issue.number} has been updated: ${issueHasUpdate}`);
    core.debug(
      `Issue #${issue.number} has been commented on: ${issueHasComments}`
    );

    if (!issueHasComments && !issueHasUpdate) {
      core.debug(
        `Closing ${issueType} because it was last updated on ${issue.updated_at}`
      );
      await this.closeIssue(issue);
    } else {
      if (this.options.removeStaleWhenUpdated) {
        await this.removeLabel(issue, staleLabel);
      }
      core.debug(`Ignoring stale ${issueType} because it was updated recenlty`);
    }
  }

  // checks to see if a given issue is still stale (has had activity on it)
  private async isIssueStillStale(
    issue: Issue,
    sinceDate: string
  ): Promise<boolean> {
    core.debug(
      `Checking for comments on issue #${issue.number} since ${sinceDate} to see if it is still stale`
    );

    if (!sinceDate) {
      return true; // if no date was provided then the issue was marked stale a long time ago
    }

    this.operationsLeft -= 1;

    // find any comments since the stale label
    const comments = await this.listIssueComments(issue.number, sinceDate);

    // if there are any user comments returned, issue is not stale anymore
    return comments.filter(comment => comment.user.type === 'User').length > 0;
  }

  // grab comments for an issue since a given date
  private async listIssueComments(
    issueNumber: number,
    sinceDate: string
  ): Promise<Comment[]> {
    // find any comments since date on the given issue
    const comments = await this.client.issues.listComments({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: issueNumber,
      since: sinceDate
    });

    return comments.data;
  }

  // grab issues from github in baches of 100
  private async getIssues(page: number): Promise<Issue[]> {
    const issueResult: OctoKitIssueList = await this.client.issues.listForRepo({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      state: 'open',
      labels: this.options.onlyLabels,
      per_page: 100,
      page
    });

    return issueResult.data;
  }

  // Mark an issue as stale with a comment and a label
  private async markStale(
    issue: Issue,
    staleMessage: string,
    staleLabel: string
  ): Promise<void> {
    core.debug(`Marking issue #${issue.number} - ${issue.title} as stale`);

    this.staleIssues.push(issue);

    this.operationsLeft -= 2;

    if (this.options.debugOnly) {
      return;
    }

    await this.client.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: issue.number,
      body: staleMessage
    });

    await this.client.issues.addLabels({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: issue.number,
      labels: [staleLabel]
    });
  }

  // Close an issue based on staleness
  private async closeIssue(issue: Issue): Promise<void> {
    core.debug(
      `Closing issue #${issue.number} - ${issue.title} for being stale`
    );

    this.closedIssues.push(issue);

    this.operationsLeft -= 1;

    if (this.options.debugOnly) {
      return;
    }

    await this.client.issues.update({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: issue.number,
      state: 'closed'
    });
  }

  // Remove a label from an issue
  private async removeLabel(issue: Issue, label: string): Promise<void> {
    core.debug(
      `Removing label ${label} from issue #${issue.number} - ${issue.title}`
    );

    this.removedLabelIssues.push(issue);

    this.operationsLeft -= 1;

    if (this.options.debugOnly) {
      return;
    }

    await this.client.issues.removeLabel({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: issue.number,
      name: encodeURIComponent(label) // A label can have a "?" in the name
    });
  }

  // returns the creation date of a given label on an issue (or nothing if no label existed)
  ///see https://developer.github.com/v3/activity/events/
  private async getLabelCreationDate(
    issue: Issue,
    label: string
  ): Promise<string> {
    core.debug(`Checking for label ${label} on issue #${issue.number}`);

    this.operationsLeft -= 1;

    const options = this.client.issues.listEvents.endpoint.merge({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      per_page: 100,
      issue_number: issue.number
    });

    const events: IssueEvent[] = await this.client.paginate(options);
    const reversedEvents = events.reverse();

    const staleLabeledEvent = reversedEvents.find(
      event => event.event === 'labeled' && event.label.name === label
    );

    return staleLabeledEvent!.created_at;
  }

  private static isLabeled(issue: Issue, label: string): boolean {
    const labelComparer: (l: Label) => boolean = l =>
      label.localeCompare(l.name, undefined, {sensitivity: 'accent'}) === 0;
    return issue.labels.filter(labelComparer).length > 0;
  }

  private static updatedSince(timestamp: string, num_days: number): boolean {
    const daysInMillis = 1000 * 60 * 60 * 24 * num_days;
    const millisSinceLastUpdated =
      new Date().getTime() - new Date(timestamp).getTime();

    return millisSinceLastUpdated < daysInMillis;
  }

  private static parseCommaSeparatedString(s: string): string[] {
    // String.prototype.split defaults to [''] when called on an empty string
    // In this case, we'd prefer to just return an empty array indicating no labels
    if (!s.length) return [];
    return s.split(',').map(l => l.trim());
  }
}
