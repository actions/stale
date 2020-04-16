import * as core from '@actions/core';
import * as github from '@actions/github';
import {Octokit} from '@octokit/rest';

type OcotoKitIssueList = Octokit.Response<Octokit.IssuesListForRepoResponse>;

export interface Issue {
  title: string;
  number: number;
  updated_at: string;
  labels: Label[];
  pull_request: any;
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

  constructor(
    options: IssueProcessorOptions,
    getIssues?: (page: number) => Promise<Issue[]>
  ) {
    this.options = options;
    this.operationsLeft = options.operationsPerRun;
    this.client = new github.GitHub(options.repoToken);

    if (getIssues) {
      this.getIssues = getIssues;
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

      if (
        exemptLabels.some((exemptLabel: string) =>
          IssueProcessor.isLabeled(issue, exemptLabel)
        )
      ) {
        core.debug(`Skipping ${issueType} because it has an exempt label`);
        continue; // don't process exempt issues
      }

      if (IssueProcessor.isLabeled(issue, staleLabel)) {
        core.debug(`Found a stale ${issueType}`);
        if (
          this.options.daysBeforeClose >= 0 &&
          IssueProcessor.wasLastUpdatedBefore(
            issue,
            this.options.daysBeforeClose
          )
        ) {
          core.debug(
            `Closing ${issueType} because it was last updated on ${issue.updated_at}`
          );
          await this.closeIssue(issue);
          this.operationsLeft -= 1;
        } else {
          core.debug(
            `Ignoring stale ${issueType} because it was updated recenlty`
          );
        }
      } else if (
        IssueProcessor.wasLastUpdatedBefore(issue, this.options.daysBeforeStale)
      ) {
        core.debug(
          `Marking ${issueType} stale because it was last updated on ${issue.updated_at}`
        );
        await this.markStale(issue, staleMessage, staleLabel);
        this.operationsLeft -= 2;
      }
    }

    // do the next batch
    return this.processIssues(page + 1);
  }

  // grab issues from github in baches of 100
  private async getIssues(page: number): Promise<Issue[]> {
    const issueResult: OcotoKitIssueList = await this.client.issues.listForRepo(
      {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        state: 'open',
        labels: this.options.onlyLabels,
        per_page: 100,
        page
      }
    );

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

  /// Close an issue based on staleness
  private async closeIssue(issue: Issue): Promise<void> {
    core.debug(
      `Closing issue #${issue.number} - ${issue.title} for being stale`
    );

    this.closedIssues.push(issue);

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

  private static isLabeled(issue: Issue, label: string): boolean {
    const labelComparer: (l: Label) => boolean = l =>
      label.localeCompare(l.name, undefined, {sensitivity: 'accent'}) === 0;
    return issue.labels.filter(labelComparer).length > 0;
  }

  private static wasLastUpdatedBefore(issue: Issue, num_days: number): boolean {
    const daysInMillis = 1000 * 60 * 60 * 24 * num_days;
    const millisSinceLastUpdated =
      new Date().getTime() - new Date(issue.updated_at).getTime();
    return millisSinceLastUpdated >= daysInMillis;
  }

  private static parseCommaSeparatedString(s: string): string[] {
    // String.prototype.split defaults to [''] when called on an empty string
    // In this case, we'd prefer to just return an empty array indicating no labels
    if (!s.length) return [];
    return s.split(',').map(l => l.trim());
  }
}
