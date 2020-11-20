import * as core from '@actions/core';
import {context, getOctokit} from '@actions/github';
import {GetResponseTypeFromEndpointMethod} from '@octokit/types';
import {isLabeled} from './functions/is-labeled';
import {labelsToList} from './functions/labels-to-list';

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
  login: string;
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
  closeIssueMessage: string;
  closePrMessage: string;
  daysBeforeStale: number;
  daysBeforeClose: number;
  staleIssueLabel: string;
  closeIssueLabel: string;
  exemptIssueLabels: string;
  stalePrLabel: string;
  closePrLabel: string;
  exemptPrLabels: string;
  onlyLabels: string;
  operationsPerRun: number;
  removeStaleWhenUpdated: boolean;
  debugOnly: boolean;
  ascending: boolean;
  skipStaleIssueMessage: boolean;
  skipStalePrMessage: boolean;
}

/***
 * Handle processing of issues for staleness/closure.
 */
export class IssueProcessor {
  readonly client: any; // need to make this the correct type
  readonly options: IssueProcessorOptions;
  private operationsLeft = 0;

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
    getLabelCreationDate?: (
      issue: Issue,
      label: string
    ) => Promise<string | undefined>
  ) {
    this.options = options;
    this.operationsLeft = options.operationsPerRun;
    this.client = getOctokit(options.repoToken);

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

  async processIssues(page = 1): Promise<number> {
    // get the next batch of issues
    const issues: Issue[] = await this.getIssues(page);
    this.operationsLeft -= 1;

    if (issues.length <= 0) {
      core.info('No more issues found to process. Exiting.');
      return this.operationsLeft;
    }

    for (const issue of issues.values()) {
      const isPr = !!issue.pull_request;

      core.info(
        `Found issue: issue #${issue.number} last updated ${issue.updated_at} (is pr? ${isPr})`
      );

      // calculate string based messages for this issue
      const staleMessage: string = isPr
        ? this.options.stalePrMessage
        : this.options.staleIssueMessage;
      const closeMessage: string = isPr
        ? this.options.closePrMessage
        : this.options.closeIssueMessage;
      const staleLabel: string = isPr
        ? this.options.stalePrLabel
        : this.options.staleIssueLabel;
      const closeLabel: string = isPr
        ? this.options.closePrLabel
        : this.options.closeIssueLabel;
      const exemptLabels: string[] = labelsToList(
        isPr ? this.options.exemptPrLabels : this.options.exemptIssueLabels
      );
      const skipMessage = isPr
        ? this.options.skipStalePrMessage
        : this.options.skipStaleIssueMessage;
      const issueType: string = isPr ? 'pr' : 'issue';
      const shouldMarkWhenStale = this.options.daysBeforeStale > -1;

      if (!staleMessage && shouldMarkWhenStale) {
        core.info(`Skipping ${issueType} due to empty stale message`);
        continue;
      }

      if (issue.state === 'closed') {
        core.info(`Skipping ${issueType} because it is closed`);
        continue; // don't process closed issues
      }

      if (issue.locked) {
        core.info(`Skipping ${issueType} because it is locked`);
        continue; // don't process locked issues
      }

      if (
        exemptLabels.some((exemptLabel: string) =>
          isLabeled(issue, exemptLabel)
        )
      ) {
        core.info(`Skipping ${issueType} because it has an exempt label`);
        continue; // don't process exempt issues
      }

      // does this issue have a stale label?
      let isStale = isLabeled(issue, staleLabel);

      // should this issue be marked stale?
      const shouldBeStale = !IssueProcessor.updatedSince(
        issue.updated_at,
        this.options.daysBeforeStale
      );

      // determine if this issue needs to be marked stale first
      if (!isStale && shouldBeStale && shouldMarkWhenStale) {
        core.info(
          `Marking ${issueType} stale because it was last updated on ${issue.updated_at} and it does not have a stale label`
        );
        await this.markStale(issue, staleMessage, staleLabel, skipMessage);
        isStale = true; // this issue is now considered stale
      }

      // process the issue if it was marked stale
      if (isStale) {
        core.info(`Found a stale ${issueType}`);
        await this.processStaleIssue(
          issue,
          issueType,
          staleLabel,
          closeMessage,
          closeLabel
        );
      }
    }

    if (this.operationsLeft <= 0) {
      core.warning('Reached max number of operations to process. Exiting.');
      return 0;
    }

    // do the next batch
    return this.processIssues(page + 1);
  }

  // handle all of the stale issue logic when we find a stale issue
  private async processStaleIssue(
    issue: Issue,
    issueType: string,
    staleLabel: string,
    closeMessage?: string,
    closeLabel?: string
  ) {
    const markedStaleOn: string =
      (await this.getLabelCreationDate(issue, staleLabel)) || issue.updated_at;
    core.info(`Issue #${issue.number} marked stale on: ${markedStaleOn}`);

    const issueHasComments: boolean = await this.hasCommentsSince(
      issue,
      markedStaleOn
    );
    core.info(
      `Issue #${issue.number} has been commented on: ${issueHasComments}`
    );

    const issueHasUpdate: boolean = IssueProcessor.updatedSince(
      issue.updated_at,
      this.options.daysBeforeClose
    );
    core.info(`Issue #${issue.number} has been updated: ${issueHasUpdate}`);

    // should we un-stale this issue?
    if (this.options.removeStaleWhenUpdated && issueHasComments) {
      core.info(
        `Issue #${issue.number} is no longer stale. Removing stale label.`
      );
      await this.removeLabel(issue, staleLabel);
    }

    // now start closing logic
    if (this.options.daysBeforeClose < 0) {
      return; // nothing to do because we aren't closing stale issues
    }

    if (!issueHasComments && !issueHasUpdate) {
      core.info(
        `Closing ${issueType} because it was last updated on ${issue.updated_at}`
      );
      await this.closeIssue(issue, closeMessage, closeLabel);
    } else {
      core.info(
        `Stale ${issueType} is not old enough to close yet (hasComments? ${issueHasComments}, hasUpdate? ${issueHasUpdate})`
      );
    }
  }

  // checks to see if a given issue is still stale (has had activity on it)
  private async hasCommentsSince(
    issue: Issue,
    sinceDate: string
  ): Promise<boolean> {
    core.info(
      `Checking for comments on issue #${issue.number} since ${sinceDate}`
    );

    if (!sinceDate) {
      return true;
    }

    // find any comments since the date
    const comments = await this.listIssueComments(issue.number, sinceDate);

    const filteredComments = comments.filter(
      comment =>
        comment.user.type === 'User' && comment.user.login !== context.actor
    );

    core.info(
      `Comments not made by actor or another bot: ${filteredComments.length}`
    );

    // if there are any user comments returned
    return filteredComments.length > 0;
  }

  // grab comments for an issue since a given date
  private async listIssueComments(
    issueNumber: number,
    sinceDate: string
  ): Promise<Comment[]> {
    // find any comments since date on the given issue
    try {
      const comments = await this.client.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        since: sinceDate
      });
      return comments.data;
    } catch (error) {
      core.error(`List issue comments error: ${error.message}`);
      return Promise.resolve([]);
    }
  }

  // grab issues from github in baches of 100
  private async getIssues(page: number): Promise<Issue[]> {
    // generate type for response
    const endpoint = this.client.issues.listForRepo;
    type OctoKitIssueList = GetResponseTypeFromEndpointMethod<typeof endpoint>;

    try {
      const issueResult: OctoKitIssueList = await this.client.issues.listForRepo(
        {
          owner: context.repo.owner,
          repo: context.repo.repo,
          state: 'open',
          labels: this.options.onlyLabels,
          per_page: 100,
          direction: this.options.ascending ? 'asc' : 'desc',
          page
        }
      );
      return issueResult.data;
    } catch (error) {
      core.error(`Get issues for repo error: ${error.message}`);
      return Promise.resolve([]);
    }
  }

  // Mark an issue as stale with a comment and a label
  private async markStale(
    issue: Issue,
    staleMessage: string,
    staleLabel: string,
    skipMessage: boolean
  ): Promise<void> {
    core.info(`Marking issue #${issue.number} as stale`);

    this.staleIssues.push(issue);

    this.operationsLeft -= 2;

    // if the issue is being marked stale, the updated date should be changed to right now
    // so that close calculations work correctly
    const newUpdatedAtDate: Date = new Date();
    issue.updated_at = newUpdatedAtDate.toString();

    if (this.options.debugOnly) {
      return;
    }

    if (!skipMessage) {
      try {
        await this.client.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issue.number,
          body: staleMessage
        });
      } catch (error) {
        core.error(`Error creating a comment: ${error.message}`);
      }
    }

    try {
      await this.client.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        labels: [staleLabel]
      });
    } catch (error) {
      core.error(`Error adding a label: ${error.message}`);
    }
  }

  // Close an issue based on staleness
  private async closeIssue(
    issue: Issue,
    closeMessage?: string,
    closeLabel?: string
  ): Promise<void> {
    core.info(`Closing issue #${issue.number} for being stale`);

    this.closedIssues.push(issue);

    this.operationsLeft -= 1;

    if (this.options.debugOnly) {
      return;
    }

    if (closeMessage) {
      try {
        await this.client.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issue.number,
          body: closeMessage
        });
      } catch (error) {
        core.error(`Error creating a comment: ${error.message}`);
      }
    }

    if (closeLabel) {
      try {
        await this.client.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issue.number,
          labels: [closeLabel]
        });
      } catch (error) {
        core.error(`Error adding a label: ${error.message}`);
      }
    }

    try {
      await this.client.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        state: 'closed'
      });
    } catch (error) {
      core.error(`Error updating an issue: ${error.message}`);
    }
  }

  // Remove a label from an issue
  private async removeLabel(issue: Issue, label: string): Promise<void> {
    core.info(`Removing label from issue #${issue.number}`);

    this.removedLabelIssues.push(issue);

    this.operationsLeft -= 1;

    if (this.options.debugOnly) {
      return;
    }

    try {
      await this.client.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        name: encodeURIComponent(label) // A label can have a "?" in the name
      });
    } catch (error) {
      core.error(`Error removing a label: ${error.message}`);
    }
  }

  // returns the creation date of a given label on an issue (or nothing if no label existed)
  ///see https://developer.github.com/v3/activity/events/
  private async getLabelCreationDate(
    issue: Issue,
    label: string
  ): Promise<string | undefined> {
    core.info(`Checking for label on issue #${issue.number}`);

    this.operationsLeft -= 1;

    const options = this.client.issues.listEvents.endpoint.merge({
      owner: context.repo.owner,
      repo: context.repo.repo,
      per_page: 100,
      issue_number: issue.number
    });

    const events: IssueEvent[] = await this.client.paginate(options);
    const reversedEvents = events.reverse();

    const staleLabeledEvent = reversedEvents.find(
      event => event.event === 'labeled' && event.label.name === label
    );

    if (!staleLabeledEvent) {
      // Must be old rather than labeled
      return undefined;
    }

    return staleLabeledEvent.created_at;
  }

  private static updatedSince(timestamp: string, num_days: number): boolean {
    const daysInMillis = 1000 * 60 * 60 * 24 * num_days;
    const millisSinceLastUpdated =
      new Date().getTime() - new Date(timestamp).getTime();

    return millisSinceLastUpdated <= daysInMillis;
  }
}
