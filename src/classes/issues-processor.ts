import {context, getOctokit} from '@actions/github';
import {GitHub} from '@actions/github/lib/utils';
import {GetResponseTypeFromEndpointMethod} from '@octokit/types';
import { coerce } from 'semver';
import {getHumanizedDate} from '../functions/dates/get-humanized-date';
import {isDateMoreRecentThan} from '../functions/dates/is-date-more-recent-than';
import {isValidDate} from '../functions/dates/is-valid-date';
import {isLabeled} from '../functions/is-labeled';
import {isPullRequest} from '../functions/is-pull-request';
import {shouldMarkWhenStale} from '../functions/should-mark-when-stale';
import {wordsToList} from '../functions/words-to-list';
import {IComment} from '../interfaces/comment';
import {IIssue} from '../interfaces/issue';
import {IIssueEvent} from '../interfaces/issue-event';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {IPullRequest} from '../interfaces/pull-request';
import {Assignees} from './assignees';
import {Issue} from './issue';
import {IssueLogger} from './loggers/issue-logger';
import {Logger} from './loggers/logger';
import {Milestones} from './milestones';
import {Statistics} from './statistics';

/***
 * Handle processing of issues for staleness/closure.
 */
export class IssuesProcessor {
  private static _updatedSince(timestamp: string, num_days: number): boolean {
    const daysInMillis = 1000 * 60 * 60 * 24 * num_days;
    const millisSinceLastUpdated =
      new Date().getTime() - new Date(timestamp).getTime();

    return millisSinceLastUpdated <= daysInMillis;
  }

  private readonly _logger: Logger = new Logger();
  private readonly _statistics: Statistics | undefined;
  private _operationsLeft = 0;
  readonly client: InstanceType<typeof GitHub>;
  readonly options: IIssuesProcessorOptions;
  readonly staleIssues: Issue[] = [];
  readonly closedIssues: Issue[] = [];
  readonly deletedBranchIssues: Issue[] = [];
  readonly removedLabelIssues: Issue[] = [];

  constructor(options: IIssuesProcessorOptions) {
    this.options = options;
    this._operationsLeft = this.options.operationsPerRun;
    this.client = getOctokit(this.options.repoToken);

    if (this.options.debugOnly) {
      this._logger.warning(
        'Executing in debug mode. Debug output will be written but no issues will be processed.'
      );
    }

    if (this.options.enableStatistics) {
      this._statistics = new Statistics(this.options);
    }
  }

  async processIssues(page = 1): Promise<number> {
    // get the next batch of issues
    const issues: Issue[] = await this.getIssues(page);
    const actor: string = await this.getActor();

    if (issues.length <= 0) {
      this._logger.info('---');
      this._statistics?.setOperationsLeft(this._operationsLeft).logStats();
      this._logger.info('No more issues found to process. Exiting.');

      return this._operationsLeft;
    }

    for (const issue of issues.values()) {
      const issueLogger: IssueLogger = new IssueLogger(issue);
      this._statistics?.incrementProcessedIssuesCount();

      issueLogger.info(`Found this $$type last updated ${issue.updated_at}`);

      // calculate string based messages for this issue
      const staleMessage: string = issue.isPullRequest
        ? this.options.stalePrMessage
        : this.options.staleIssueMessage;
      const closeMessage: string = issue.isPullRequest
        ? this.options.closePrMessage
        : this.options.closeIssueMessage;
      const staleLabel: string = issue.isPullRequest
        ? this.options.stalePrLabel
        : this.options.staleIssueLabel;
      const closeLabel: string = issue.isPullRequest
        ? this.options.closePrLabel
        : this.options.closeIssueLabel;
      const skipMessage = issue.isPullRequest
        ? this.options.skipStalePrMessage
        : this.options.skipStaleIssueMessage;
      const daysBeforeStale: number = issue.isPullRequest
        ? this._getDaysBeforePrStale()
        : this._getDaysBeforeIssueStale();
      const onlyLabels: string[] = wordsToList(this._getOnlyLabels(issue));

      if (onlyLabels.length > 0) {
        issueLogger.info(
          `The option "onlyLabels" was specified to only processed the issues and pull requests with all those labels (${onlyLabels.length})`
        );

        const hasAllWhitelistedLabels: boolean = onlyLabels.every(
          (label: Readonly<string>): boolean => {
            return isLabeled(issue, label);
          }
        );

        if (!hasAllWhitelistedLabels) {
          issueLogger.info(
            `Skipping this $$type because it doesn't have all the required labels`
          );
          continue; // Don't process issues without all of the required labels
        } else {
          issueLogger.info(
            `All the required labels are present on this $$type. Continuing the process`
          );
        }
      } else {
        issueLogger.info(
          `The option "onlyLabels" was not specified. Continuing the process for this $$type`
        );
      }

      issueLogger.info(`Days before $$type stale: ${daysBeforeStale}`);

      const shouldMarkAsStale: boolean = shouldMarkWhenStale(daysBeforeStale);

      if (!staleMessage && shouldMarkAsStale) {
        issueLogger.info(`Skipping $$type due to empty stale message`);
        continue;
      }

      if (issue.state === 'closed') {
        issueLogger.info(`Skipping $$type because it is closed`);
        continue; // don't process closed issues
      }

      if (issue.locked) {
        issueLogger.info(`Skipping $$type because it is locked`);
        continue; // don't process locked issues
      }

      // Try to remove the close label when not close/locked issue or PR
      await this._removeCloseLabel(issue, closeLabel);

      if (this.options.startDate) {
        const startDate: Date = new Date(this.options.startDate);
        const createdAt: Date = new Date(issue.created_at);

        issueLogger.info(
          `A start date was specified for the ${getHumanizedDate(startDate)} (${
            this.options.startDate
          })`
        );

        // Expecting that GitHub will always set a creation date on the issues and PRs
        // But you never know!
        if (!isValidDate(createdAt)) {
          throw new Error(
            `Invalid issue field: "created_at". Expected a valid date`
          );
        }

        issueLogger.info(
          `$$type created the ${getHumanizedDate(createdAt)} (${
            issue.created_at
          })`
        );

        if (!isDateMoreRecentThan(createdAt, startDate)) {
          issueLogger.info(
            `Skipping $$type because it was created before the specified start date`
          );

          continue; // don't process issues which were created before the start date
        }
      }

      if (issue.isStale) {
        issueLogger.info(`This $$type has a stale label`);
      } else {
        issueLogger.info(`This $$type hasn't a stale label`);
      }

      const exemptLabels: string[] = wordsToList(
        issue.isPullRequest
          ? this.options.exemptPrLabels
          : this.options.exemptIssueLabels
      );

      if (
        exemptLabels.some((exemptLabel: Readonly<string>): boolean =>
          isLabeled(issue, exemptLabel)
        )
      ) {
        if (issue.isStale) {
          issueLogger.info(`An exempt label was added after the stale label.`);
          await this._removeStaleLabel(issue, staleLabel);
        }

        issueLogger.info(`Skipping $$type because it has an exempt label`);
        continue; // don't process exempt issues
      }

      const anyOfLabels: string[] = wordsToList(this.options.anyOfLabels);
      if (
        anyOfLabels.length &&
        !anyOfLabels.some((label: Readonly<string>): boolean =>
          isLabeled(issue, label)
        )
      ) {
        issueLogger.info(
          `Skipping $$type because it does not have any of the required labels`
        );
        continue; // don't process issues without any of the required labels
      }

      const milestones: Milestones = new Milestones(this.options, issue);

      if (milestones.shouldExemptMilestones()) {
        issueLogger.info(
          `Skipping $$type because it has an exempted milestone`
        );
        continue; // don't process exempt milestones
      }

      const assignees: Assignees = new Assignees(this.options, issue);

      if (assignees.shouldExemptAssignees()) {
        continue; // don't process exempt assignees
      }

      // should this issue be marked stale?
      const shouldBeStale = !IssuesProcessor._updatedSince(
        issue.updated_at,
        daysBeforeStale
      );

      // determine if this issue needs to be marked stale first
      if (!issue.isStale && shouldBeStale && shouldMarkAsStale) {
        issueLogger.info(
          `Marking $$type stale because it was last updated on ${issue.updated_at} and it does not have a stale label`
        );
        await this._markStale(issue, staleMessage, staleLabel, skipMessage);
        issue.isStale = true; // this issue is now considered stale
      } else if (!issue.isStale) {
        issueLogger.info(
          `Not marking as stale: shouldBeStale=${shouldBeStale}, shouldMarkAsStale=${shouldMarkAsStale}`
        );
      }

      // process the issue if it was marked stale
      if (issue.isStale) {
        issueLogger.info(`Found a stale $$type`);
        await this._processStaleIssue(
          issue,
          staleLabel,
          actor,
          closeMessage,
          closeLabel
        );
      }
    }

    if (this._operationsLeft <= 0) {
      this._logger.warning(
        'Reached max number of operations to process. Exiting.'
      );
      return 0;
    }

    // do the next batch
    return this.processIssues(page + 1);
  }

  // grab comments for an issue since a given date
  async listIssueComments(
    issueNumber: number,
    sinceDate: string
  ): Promise<IComment[]> {
    // find any comments since date on the given issue
    try {
      this._operationsLeft -= 1;
      this._statistics?.incrementFetchedIssuesCommentsCount();
      const comments = await this.client.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        since: sinceDate
      });
      return comments.data;
    } catch (error) {
      this._logger.error(`List issue comments error: ${error.message}`);
      return Promise.resolve([]);
    }
  }

  // get the actor from the GitHub token or context
  async getActor(): Promise<string> {
    let actor;

    try {
      this._operationsLeft -= 1;
      actor = await this.client.users.getAuthenticated();
      this._logger.info('Actor is from client')
    } catch (error) {
      this._logger.info('Actor is from context')
      return context.actor;
    }

    return actor.data.login;
  }

  // grab issues from github in batches of 100
  async getIssues(page: number): Promise<Issue[]> {
    // generate type for response
    const endpoint = this.client.issues.listForRepo;
    type OctoKitIssueList = GetResponseTypeFromEndpointMethod<typeof endpoint>;

    try {
      this._operationsLeft -= 1;
      this._statistics?.incrementFetchedIssuesCount();
      const issueResult: OctoKitIssueList = await this.client.issues.listForRepo(
        {
          owner: context.repo.owner,
          repo: context.repo.repo,
          state: 'open',
          per_page: 100,
          direction: this.options.ascending ? 'asc' : 'desc',
          page
        }
      );

      return issueResult.data.map(
        (issue: Readonly<IIssue>): Issue => new Issue(this.options, issue)
      );
    } catch (error) {
      this._logger.error(`Get issues for repo error: ${error.message}`);
      return Promise.resolve([]);
    }
  }

  // returns the creation date of a given label on an issue (or nothing if no label existed)
  ///see https://developer.github.com/v3/activity/events/
  async getLabelCreationDate(
    issue: Issue,
    label: string
  ): Promise<string | undefined> {
    const issueLogger: IssueLogger = new IssueLogger(issue);

    issueLogger.info(`Checking for label on $$type`);

    this._operationsLeft -= 1;
    this._statistics?.incrementFetchedIssuesEventsCount();
    const options = this.client.issues.listEvents.endpoint.merge({
      owner: context.repo.owner,
      repo: context.repo.repo,
      per_page: 100,
      issue_number: issue.number
    });

    const events: IIssueEvent[] = await this.client.paginate(options);
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

  // handle all of the stale issue logic when we find a stale issue
  private async _processStaleIssue(
    issue: Issue,
    staleLabel: string,
    actor: string,
    closeMessage?: string,
    closeLabel?: string
  ) {
    const issueLogger: IssueLogger = new IssueLogger(issue);
    const markedStaleOn: string =
      (await this.getLabelCreationDate(issue, staleLabel)) || issue.updated_at;
    issueLogger.info(`$$type marked stale on: ${markedStaleOn}`);

    const issueHasComments: boolean = await this._hasCommentsSince(
      issue,
      markedStaleOn,
      actor
    );
    issueLogger.info(`$$type has been commented on: ${issueHasComments}`);

    const isPr: boolean = isPullRequest(issue);
    const daysBeforeClose: number = isPr
      ? this._getDaysBeforePrClose()
      : this._getDaysBeforeIssueClose();

    issueLogger.info(`Days before $$type close: ${daysBeforeClose}`);

    const issueHasUpdate: boolean = IssuesProcessor._updatedSince(
      issue.updated_at,
      daysBeforeClose
    );
    issueLogger.info(`$$type has been updated: ${issueHasUpdate}`);

    // should we un-stale this issue?
    if (this.options.removeStaleWhenUpdated && issueHasComments) {
      await this._removeStaleLabel(issue, staleLabel);
    }

    // now start closing logic
    if (daysBeforeClose < 0) {
      return; // nothing to do because we aren't closing stale issues
    }

    if (!issueHasComments && !issueHasUpdate) {
      issueLogger.info(
        `Closing $$type because it was last updated on ${issue.updated_at}`
      );
      await this._closeIssue(issue, closeMessage, closeLabel);

      if (this.options.deleteBranch && issue.pull_request) {
        issueLogger.info(
          `Deleting branch for as delete-branch option was specified`
        );
        await this._deleteBranch(issue);
        this.deletedBranchIssues.push(issue);
      }
    } else {
      issueLogger.info(
        `Stale $$type is not old enough to close yet (hasComments? ${issueHasComments}, hasUpdate? ${issueHasUpdate})`
      );
    }
  }

  // checks to see if a given issue is still stale (has had activity on it)
  private async _hasCommentsSince(
    issue: Issue,
    sinceDate: string,
    actor: string
  ): Promise<boolean> {
    const issueLogger: IssueLogger = new IssueLogger(issue);

    issueLogger.info(`Checking for comments on $$type since ${sinceDate}`);

    if (!sinceDate) {
      return true;
    }

    // find any comments since the date
    const comments = await this.listIssueComments(issue.number, sinceDate);

    issueLogger.info('Not filtering for debug purposes')
    const filteredComments = comments.filter(
      comment => comment.user.type === 'User' && comment.user.login !== actor
    );

    issueLogger.info(
      `Comments not made by actor or another bot: ${filteredComments.length}`
    );

    // if there are any user comments returned
    return filteredComments.length > 0;
  }

  // Mark an issue as stale with a comment and a label
  private async _markStale(
    issue: Issue,
    staleMessage: string,
    staleLabel: string,
    skipMessage: boolean
  ): Promise<void> {
    const issueLogger: IssueLogger = new IssueLogger(issue);

    issueLogger.info(`Marking $$type as stale`);
    this.staleIssues.push(issue);

    // if the issue is being marked stale, the updated date should be changed to right now
    // so that close calculations work correctly
    const newUpdatedAtDate: Date = new Date();
    issue.updated_at = newUpdatedAtDate.toString();

    if (this.options.debugOnly) {
      return;
    }

    if (!skipMessage) {
      try {
        this._operationsLeft -= 1;
        this._statistics?.incrementAddedComment();
        await this.client.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issue.number,
          body: staleMessage
        });
      } catch (error) {
        issueLogger.error(`Error creating a comment: ${error.message}`);
      }
    }

    try {
      this._operationsLeft -= 1;
      this._statistics?.incrementAddedLabel();
      this._statistics?.incrementStaleIssuesCount();
      await this.client.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        labels: [staleLabel]
      });
    } catch (error) {
      issueLogger.error(`Error adding a label: ${error.message}`);
    }
  }

  // Close an issue based on staleness
  private async _closeIssue(
    issue: Issue,
    closeMessage?: string,
    closeLabel?: string
  ): Promise<void> {
    const issueLogger: IssueLogger = new IssueLogger(issue);

    issueLogger.info(`Closing $$type for being stale`);
    this.closedIssues.push(issue);

    if (this.options.debugOnly) {
      return;
    }

    if (closeMessage) {
      try {
        this._operationsLeft -= 1;
        this._statistics?.incrementAddedComment();
        await this.client.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issue.number,
          body: closeMessage
        });
      } catch (error) {
        issueLogger.error(`Error creating a comment: ${error.message}`);
      }
    }

    if (closeLabel) {
      try {
        this._operationsLeft -= 1;
        this._statistics?.incrementAddedLabel();
        await this.client.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issue.number,
          labels: [closeLabel]
        });
      } catch (error) {
        issueLogger.error(`Error adding a label: ${error.message}`);
      }
    }

    try {
      this._operationsLeft -= 1;
      this._statistics?.incrementClosedIssuesCount();
      await this.client.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        state: 'closed'
      });
    } catch (error) {
      issueLogger.error(`Error updating this $$type: ${error.message}`);
    }
  }

  private async _getPullRequest(
    issue: Issue
  ): Promise<IPullRequest | undefined | void> {
    const issueLogger: IssueLogger = new IssueLogger(issue);

    if (this.options.debugOnly) {
      return;
    }

    try {
      this._operationsLeft -= 1;
      this._statistics?.incrementFetchedPullRequestsCount();
      const pullRequest = await this.client.pulls.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: issue.number
      });

      return pullRequest.data;
    } catch (error) {
      issueLogger.error(`Error getting this $$type: ${error.message}`);
    }
  }

  // Delete the branch on closed pull request
  private async _deleteBranch(issue: Issue): Promise<void> {
    const issueLogger: IssueLogger = new IssueLogger(issue);

    issueLogger.info(`Delete branch from closed $$type - ${issue.title}`);

    const pullRequest = await this._getPullRequest(issue);

    if (!pullRequest) {
      issueLogger.info(
        `Not deleting branch as pull request not found for this $$type`
      );
      return;
    }

    if (this.options.debugOnly) {
      return;
    }

    const branch = pullRequest.head.ref;
    issueLogger.info(`Deleting branch ${branch} from closed $$type`);

    try {
      this._operationsLeft -= 1;
      this._statistics?.incrementDeletedBranchesCount();
      await this.client.git.deleteRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: `heads/${branch}`
      });
    } catch (error) {
      issueLogger.error(
        `Error deleting branch ${branch} from $$type: ${error.message}`
      );
    }
  }

  // Remove a label from an issue
  private async _removeLabel(issue: Issue, label: string): Promise<void> {
    const issueLogger: IssueLogger = new IssueLogger(issue);

    issueLogger.info(`Removing label "${label}" from $$type`);
    this.removedLabelIssues.push(issue);

    // @todo remove the debug only to be able to test the code below
    if (this.options.debugOnly) {
      return;
    }

    try {
      this._operationsLeft -= 1;
      this._statistics?.incrementDeletedLabelsCount();
      await this.client.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        name: label
      });
    } catch (error) {
      issueLogger.error(`Error removing a label: ${error.message}`);
    }
  }

  private _getDaysBeforeIssueStale(): number {
    return isNaN(this.options.daysBeforeIssueStale)
      ? this.options.daysBeforeStale
      : this.options.daysBeforeIssueStale;
  }

  private _getDaysBeforePrStale(): number {
    return isNaN(this.options.daysBeforePrStale)
      ? this.options.daysBeforeStale
      : this.options.daysBeforePrStale;
  }

  private _getDaysBeforeIssueClose(): number {
    return isNaN(this.options.daysBeforeIssueClose)
      ? this.options.daysBeforeClose
      : this.options.daysBeforeIssueClose;
  }

  private _getDaysBeforePrClose(): number {
    return isNaN(this.options.daysBeforePrClose)
      ? this.options.daysBeforeClose
      : this.options.daysBeforePrClose;
  }

  private _getOnlyLabels(issue: Issue): string {
    if (issue.isPullRequest) {
      if (this.options.onlyPrLabels !== '') {
        return this.options.onlyPrLabels;
      }
    } else {
      if (this.options.onlyIssueLabels !== '') {
        return this.options.onlyIssueLabels;
      }
    }

    return this.options.onlyLabels;
  }

  private async _removeStaleLabel(
    issue: Issue,
    staleLabel: Readonly<string>
  ): Promise<void> {
    const issueLogger: IssueLogger = new IssueLogger(issue);

    issueLogger.info(
      `The $$type is no longer stale. Removing the stale label...`
    );

    await this._removeLabel(issue, staleLabel);
    this._statistics?.incrementUndoStaleIssuesCount();
  }

  private async _removeCloseLabel(
    issue: Issue,
    closeLabel: Readonly<string | undefined>
  ): Promise<void> {
    const issueLogger: IssueLogger = new IssueLogger(issue);

    issueLogger.info(
      `The $$type is not closed nor locked. Trying to remove the close label...`
    );

    if (!closeLabel) {
      issueLogger.info(`There is no close label on this $$type. Skip`);

      return Promise.resolve();
    }

    if (isLabeled(issue, closeLabel)) {
      issueLogger.info(
        `The $$type has a close label "${closeLabel}". Removing the close label...`
      );

      await this._removeLabel(issue, closeLabel);
      this._statistics?.incrementDeletedCloseLabelsCount();
    }
  }
}
