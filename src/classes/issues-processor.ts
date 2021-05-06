import * as core from '@actions/core';
import {context, getOctokit} from '@actions/github';
import {GitHub} from '@actions/github/lib/utils';
import {GetResponseTypeFromEndpointMethod} from '@octokit/types';
import chalk from 'chalk';
import {Option} from '../enums/option';
import {getHumanizedDate} from '../functions/dates/get-humanized-date';
import {isDateMoreRecentThan} from '../functions/dates/is-date-more-recent-than';
import {isValidDate} from '../functions/dates/is-valid-date';
import {isBoolean} from '../functions/is-boolean';
import {isLabeled} from '../functions/is-labeled';
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
import {StaleOperations} from './stale-operations';
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

  private static _endIssueProcessing(issue: Issue): void {
    const consumedOperationsCount: number = issue.operations.getConsumedOperationsCount();

    if (consumedOperationsCount > 0) {
      const issueLogger: IssueLogger = new IssueLogger(issue);

      issueLogger.info(
        chalk.cyan(consumedOperationsCount),
        `operation${
          consumedOperationsCount > 1 ? 's' : ''
        } consumed for this $$type`
      );
    }
  }

  private static _getStaleMessageUsedOptionName(
    issue: Readonly<Issue>
  ): Option.StalePrMessage | Option.StaleIssueMessage {
    return issue.isPullRequest
      ? Option.StalePrMessage
      : Option.StaleIssueMessage;
  }

  private readonly _logger: Logger = new Logger();
  private readonly _operations: StaleOperations;
  private readonly _statistics: Statistics | undefined;
  readonly client: InstanceType<typeof GitHub>;
  readonly options: IIssuesProcessorOptions;
  readonly staleIssues: Issue[] = [];
  readonly closedIssues: Issue[] = [];
  readonly deletedBranchIssues: Issue[] = [];
  readonly removedLabelIssues: Issue[] = [];

  constructor(options: IIssuesProcessorOptions) {
    this.options = options;
    this.client = getOctokit(this.options.repoToken);
    this._operations = new StaleOperations(this.options);

    this._logger.info(chalk.yellow('Starting the stale action process...'));

    if (this.options.debugOnly) {
      this._logger.warning(chalk.yellowBright('Executing in debug mode!'));
      this._logger.warning(
        chalk.yellowBright(
          'The debug output will be written but no issues/PRs will be processed.'
        )
      );
    }

    if (this.options.enableStatistics) {
      this._statistics = new Statistics();
    }
  }

  async processIssues(page: Readonly<number> = 1): Promise<number> {
    // get the next batch of issues
    const issues: Issue[] = await this.getIssues(page);
    const actor: string = await this.getActor();

    if (issues.length <= 0) {
      this._logger.info(
        chalk.green('No more issues found to process. Exiting...')
      );
      this._statistics
        ?.setRemainingOperations(this._operations.getRemainingOperationsCount())
        .logStats();

      return this._operations.getRemainingOperationsCount();
    } else {
      this._logger.info(
        chalk.yellow(
          `Processing the batch of issues ${chalk.cyan(
            `#${page}`
          )} containing ${chalk.cyan(issues.length)} issue${
            issues.length > 1 ? 's' : ''
          }...`
        )
      );
    }

    for (const issue of issues.values()) {
      const issueLogger: IssueLogger = new IssueLogger(issue);
      this._statistics?.incrementProcessedItemsCount(issue);

      issueLogger.info(
        `Found this $$type last updated at: ${chalk.cyan(issue.updated_at)}`
      );

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
          `The option ${issueLogger.createOptionLink(
            Option.OnlyLabels
          )} was specified to only process issues and pull requests with all those labels (${chalk.cyan(
            onlyLabels.length
          )})`
        );

        const hasAllWhitelistedLabels: boolean = onlyLabels.every(
          (label: Readonly<string>): boolean => {
            return isLabeled(issue, label);
          }
        );

        if (!hasAllWhitelistedLabels) {
          issueLogger.info(
            chalk.white('└──'),
            `Skipping this $$type because it doesn't have all the required labels`
          );

          IssuesProcessor._endIssueProcessing(issue);
          continue; // Don't process issues without all of the required labels
        } else {
          issueLogger.info(
            chalk.white('├──'),
            `All the required labels are present on this $$type`
          );
          issueLogger.info(
            chalk.white('└──'),
            `Continuing the process for this $$type`
          );
        }
      } else {
        issueLogger.info(
          `The option ${issueLogger.createOptionLink(
            Option.OnlyLabels
          )} was not specified`
        );
        issueLogger.info(
          chalk.white('└──'),
          `Continuing the process for this $$type`
        );
      }

      issueLogger.info(
        `Days before $$type stale: ${chalk.cyan(daysBeforeStale)}`
      );

      const shouldMarkAsStale: boolean = shouldMarkWhenStale(daysBeforeStale);

      if (!staleMessage && shouldMarkAsStale) {
        issueLogger.info(
          `Skipping this $$type because it should be marked as stale based on the option ${issueLogger.createOptionLink(
            this._getDaysBeforeStaleUsedOptionName(issue)
          )} (${chalk.cyan(
            daysBeforeStale
          )}) but the option ${issueLogger.createOptionLink(
            IssuesProcessor._getStaleMessageUsedOptionName(issue)
          )} is not set`
        );
        IssuesProcessor._endIssueProcessing(issue);
        continue;
      }

      if (issue.state === 'closed') {
        issueLogger.info(`Skipping this $$type because it is closed`);
        IssuesProcessor._endIssueProcessing(issue);
        continue; // Don't process closed issues
      }

      if (issue.locked) {
        issueLogger.info(`Skipping this $$type because it is locked`);
        IssuesProcessor._endIssueProcessing(issue);
        continue; // Don't process locked issues
      }

      // Try to remove the close label when not close/locked issue or PR
      await this._removeCloseLabel(issue, closeLabel);

      if (this.options.startDate) {
        const startDate: Date = new Date(this.options.startDate);
        const createdAt: Date = new Date(issue.created_at);

        issueLogger.info(
          `A start date was specified for the ${getHumanizedDate(
            startDate
          )} (${chalk.cyan(this.options.startDate)})`
        );

        // Expecting that GitHub will always set a creation date on the issues and PRs
        // But you never know!
        if (!isValidDate(createdAt)) {
          IssuesProcessor._endIssueProcessing(issue);
          core.setFailed(
            new Error(
              `Invalid issue field: "created_at". Expected a valid date`
            )
          );
        }

        issueLogger.info(
          `$$type created the ${getHumanizedDate(createdAt)} (${chalk.cyan(
            issue.created_at
          )})`
        );

        if (!isDateMoreRecentThan(createdAt, startDate)) {
          issueLogger.info(
            `Skipping this $$type because it was created before the specified start date`
          );

          IssuesProcessor._endIssueProcessing(issue);
          continue; // Don't process issues which were created before the start date
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

        issueLogger.info(`Skipping this $$type because it has an exempt label`);
        IssuesProcessor._endIssueProcessing(issue);
        continue; // Don't process exempt issues
      }

      const anyOfLabels: string[] = wordsToList(this._getAnyOfLabels(issue));

      if (anyOfLabels.length > 0) {
        issueLogger.info(
          `The option ${issueLogger.createOptionLink(
            Option.AnyOfLabels
          )} was specified to only process the issues and pull requests with one of those labels (${chalk.cyan(
            anyOfLabels.length
          )})`
        );

        const hasOneOfWhitelistedLabels: boolean = anyOfLabels.some(
          (label: Readonly<string>): boolean => {
            return isLabeled(issue, label);
          }
        );

        if (!hasOneOfWhitelistedLabels) {
          issueLogger.info(
            chalk.white('└──'),
            `Skipping this $$type because it doesn't have one of the required labels`
          );
          IssuesProcessor._endIssueProcessing(issue);
          continue; // Don't process issues without any of the required labels
        } else {
          issueLogger.info(
            chalk.white('├──'),
            `One of the required labels is present on this $$type`
          );
          issueLogger.info(
            chalk.white('└──'),
            `Continuing the process for this $$type`
          );
        }
      } else {
        issueLogger.info(
          `The option ${issueLogger.createOptionLink(
            Option.AnyOfLabels
          )} was not specified`
        );
        issueLogger.info(
          chalk.white('└──'),
          `Continuing the process for this $$type`
        );
      }

      const milestones: Milestones = new Milestones(this.options, issue);

      if (milestones.shouldExemptMilestones()) {
        IssuesProcessor._endIssueProcessing(issue);
        continue; // Don't process exempt milestones
      }

      const assignees: Assignees = new Assignees(this.options, issue);

      if (assignees.shouldExemptAssignees()) {
        IssuesProcessor._endIssueProcessing(issue);
        continue; // Don't process exempt assignees
      }

      // Should this issue be marked stale?
      const shouldBeStale = !IssuesProcessor._updatedSince(
        issue.updated_at,
        daysBeforeStale
      );

      // Determine if this issue needs to be marked stale first
      if (!issue.isStale) {
        issueLogger.info(`This $$type is not stale`);
        const updatedAtDate: Date = new Date(issue.updated_at);

        if (shouldBeStale) {
          issueLogger.info(
            `This $$type should be stale based on the last update date the ${getHumanizedDate(
              updatedAtDate
            )} (${chalk.cyan(issue.updated_at)})`
          );

          if (shouldMarkAsStale) {
            issueLogger.info(
              `This $$type should be marked as stale based on the option ${issueLogger.createOptionLink(
                this._getDaysBeforeStaleUsedOptionName(issue)
              )} (${chalk.cyan(daysBeforeStale)})`
            );
            await this._markStale(issue, staleMessage, staleLabel, skipMessage);
            issue.isStale = true; // This issue is now considered stale
            issueLogger.info(`This $$type is now stale`);
          } else {
            issueLogger.info(
              `This $$type should not be marked as stale based on the option ${issueLogger.createOptionLink(
                this._getDaysBeforeStaleUsedOptionName(issue)
              )} (${chalk.cyan(daysBeforeStale)})`
            );
          }
        } else {
          issueLogger.info(
            `This $$type should not be stale based on the last update date the ${getHumanizedDate(
              updatedAtDate
            )} (${chalk.cyan(issue.updated_at)})`
          );
        }
      }

      // Process the issue if it was marked stale
      if (issue.isStale) {
        issueLogger.info(`This $$type is already stale`);
        await this._processStaleIssue(
          issue,
          staleLabel,
          actor,
          closeMessage,
          closeLabel
        );
      }

      IssuesProcessor._endIssueProcessing(issue);
    }

    if (!this._operations.hasRemainingOperations()) {
      this._logger.warning(
        chalk.yellowBright('No more operations left! Exiting...')
      );
      this._logger.warning(
        chalk.yellowBright(
          `If you think that not enough issues were processed you could try to increase the quantity related to the ${this._logger.createOptionLink(
            Option.OperationsPerRun
          )} option which is currently set to ${chalk.cyan(
            this.options.operationsPerRun
          )}`
        )
      );

      return 0;
    }

    this._logger.info(
      chalk.green(`Batch ${chalk.cyan(`#${page}`)} processed.`)
    );

    // Do the next batch
    return this.processIssues(page + 1);
  }

  // Grab comments for an issue since a given date
  async listIssueComments(
    issueNumber: Readonly<number>,
    sinceDate: Readonly<string>
  ): Promise<IComment[]> {
    // Find any comments since date on the given issue
    try {
      this._operations.consumeOperation();
      this._statistics?.incrementFetchedItemsCommentsCount();
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
      this._operations.consumeOperation();
      actor = await this.client.users.getAuthenticated();
    } catch (error) {
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
      this._operations.consumeOperation();
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
      this._statistics?.incrementFetchedItemsCount(issueResult.data.length);

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

    issueLogger.info(`Checking for label on this $$type`);

    this._consumeIssueOperation(issue);
    this._statistics?.incrementFetchedItemsEventsCount();
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
    issueLogger.info(`$$type marked stale on: ${chalk.cyan(markedStaleOn)}`);

    const issueHasComments: boolean = await this._hasCommentsSince(
      issue,
      markedStaleOn,
      actor
    );
    issueLogger.info(
      `$$type has been commented on: ${chalk.cyan(issueHasComments)}`
    );

    const daysBeforeClose: number = issue.isPullRequest
      ? this._getDaysBeforePrClose()
      : this._getDaysBeforeIssueClose();

    issueLogger.info(
      `Days before $$type close: ${chalk.cyan(daysBeforeClose)}`
    );

    const issueHasUpdate: boolean = IssuesProcessor._updatedSince(
      issue.updated_at,
      daysBeforeClose
    );
    issueLogger.info(`$$type has been updated: ${chalk.cyan(issueHasUpdate)}`);

    // should we un-stale this issue?
    if (this._shouldRemoveStaleWhenUpdated(issue) && issueHasComments) {
      await this._removeStaleLabel(issue, staleLabel);

      issueLogger.info(`Skipping the process since the $$type is now un-stale`);

      return; // nothing to do because it is no longer stale
    }

    // now start closing logic
    if (daysBeforeClose < 0) {
      return; // nothing to do because we aren't closing stale issues
    }

    if (!issueHasComments && !issueHasUpdate) {
      issueLogger.info(
        `Closing $$type because it was last updated on! ${chalk.cyan(
          issue.updated_at
        )}`
      );
      await this._closeIssue(issue, closeMessage, closeLabel);

      if (this.options.deleteBranch && issue.pull_request) {
        issueLogger.info(
          `Deleting the branch the option ${issueLogger.createOptionLink(
            Option.DeleteBranch
          )} was specified`
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

    issueLogger.info(
      `Checking for comments on $$type since: ${chalk.cyan(sinceDate)}`
    );

    if (!sinceDate) {
      return true;
    }

    // find any comments since the date
    const comments = await this.listIssueComments(issue.number, sinceDate);

    const filteredComments = comments.filter(
      comment => comment.user.type === 'User' && comment.user.login !== actor
    );

    issueLogger.info(
      `Comments not made by actor or another bot: ${chalk.cyan(
        filteredComments.length
      )}`
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

    issueLogger.info(`Marking this $$type as stale`);
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
        this._consumeIssueOperation(issue);
        this._statistics?.incrementAddedItemsComment(issue);
        await this.client.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issue.number,
          body: staleMessage
        });
      } catch (error) {
        issueLogger.error(`Error when creating a comment: ${error.message}`);
      }
    }

    try {
      this._consumeIssueOperation(issue);
      this._statistics?.incrementAddedItemsLabel(issue);
      this._statistics?.incrementStaleItemsCount(issue);
      await this.client.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        labels: [staleLabel]
      });
    } catch (error) {
      issueLogger.error(`Error when adding a label: ${error.message}`);
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
        this._consumeIssueOperation(issue);
        this._statistics?.incrementAddedItemsComment(issue);
        await this.client.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issue.number,
          body: closeMessage
        });
      } catch (error) {
        issueLogger.error(`Error when creating a comment: ${error.message}`);
      }
    }

    if (closeLabel) {
      try {
        this._consumeIssueOperation(issue);
        this._statistics?.incrementAddedItemsLabel(issue);
        await this.client.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issue.number,
          labels: [closeLabel]
        });
      } catch (error) {
        issueLogger.error(`Error when adding a label: ${error.message}`);
      }
    }

    try {
      this._consumeIssueOperation(issue);
      this._statistics?.incrementClosedItemsCount(issue);
      await this.client.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        state: 'closed'
      });
    } catch (error) {
      issueLogger.error(`Error when updating this $$type: ${error.message}`);
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
      this._consumeIssueOperation(issue);
      this._statistics?.incrementFetchedPullRequestsCount();
      const pullRequest = await this.client.pulls.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: issue.number
      });

      return pullRequest.data;
    } catch (error) {
      issueLogger.error(`Error when getting this $$type: ${error.message}`);
    }
  }

  // Delete the branch on closed pull request
  private async _deleteBranch(issue: Issue): Promise<void> {
    const issueLogger: IssueLogger = new IssueLogger(issue);

    issueLogger.info(`Delete branch from closed $$type - ${issue.title}`);

    const pullRequest = await this._getPullRequest(issue);

    if (!pullRequest) {
      issueLogger.info(
        `Not deleting this branch as no pull request was found for this $$type`
      );
      return;
    }

    if (this.options.debugOnly) {
      return;
    }

    const branch = pullRequest.head.ref;
    issueLogger.info(
      `Deleting the branch "${chalk.cyan(branch)}" from closed $$type`
    );

    try {
      this._consumeIssueOperation(issue);
      this._statistics?.incrementDeletedBranchesCount();
      await this.client.git.deleteRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: `heads/${branch}`
      });
    } catch (error) {
      issueLogger.error(
        `Error when deleting the branch "${chalk.cyan(branch)}" from $$type: ${
          error.message
        }`
      );
    }
  }

  // Remove a label from an issue or a pull request
  private async _removeLabel(issue: Issue, label: string): Promise<void> {
    const issueLogger: IssueLogger = new IssueLogger(issue);

    issueLogger.info(
      `Removing the label "${chalk.cyan(label)}" from this $$type...`
    );
    this.removedLabelIssues.push(issue);

    if (this.options.debugOnly) {
      return;
    }

    try {
      this._consumeIssueOperation(issue);
      this._statistics?.incrementDeletedItemsLabelsCount(issue);
      await this.client.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
        name: label
      });
      issueLogger.info(`The label "${chalk.cyan(label)}" was removed`);
    } catch (error) {
      issueLogger.error(
        `Error when removing the label: "${chalk.cyan(error.message)}"`
      );
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

  private _getAnyOfLabels(issue: Issue): string {
    if (issue.isPullRequest) {
      if (this.options.anyOfPrLabels !== '') {
        return this.options.anyOfPrLabels;
      }
    } else {
      if (this.options.anyOfIssueLabels !== '') {
        return this.options.anyOfIssueLabels;
      }
    }

    return this.options.anyOfLabels;
  }

  private _shouldRemoveStaleWhenUpdated(issue: Issue): boolean {
    if (issue.isPullRequest) {
      if (isBoolean(this.options.removePrStaleWhenUpdated)) {
        return this.options.removePrStaleWhenUpdated;
      }

      return this.options.removeStaleWhenUpdated;
    }

    if (isBoolean(this.options.removeIssueStaleWhenUpdated)) {
      return this.options.removeIssueStaleWhenUpdated;
    }

    return this.options.removeStaleWhenUpdated;
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
    this._statistics?.incrementUndoStaleItemsCount(issue);
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
        `The $$type has a close label "${chalk.cyan(
          closeLabel
        )}". Removing the close label...`
      );

      await this._removeLabel(issue, closeLabel);
      this._statistics?.incrementDeletedCloseItemsLabelsCount(issue);
    }
  }

  private _consumeIssueOperation(issue: Readonly<Issue>): void {
    this._operations.consumeOperation();
    issue.operations.consumeOperation();
  }

  private _getDaysBeforeStaleUsedOptionName(
    issue: Readonly<Issue>
  ):
    | Option.DaysBeforeStale
    | Option.DaysBeforeIssueStale
    | Option.DaysBeforePrStale {
    return issue.isPullRequest
      ? this._getDaysBeforePrStaleUsedOptionName()
      : this._getDaysBeforeIssueStaleUsedOptionName();
  }

  private _getDaysBeforeIssueStaleUsedOptionName():
    | Option.DaysBeforeStale
    | Option.DaysBeforeIssueStale {
    return isNaN(this.options.daysBeforeIssueStale)
      ? Option.DaysBeforeStale
      : Option.DaysBeforeIssueStale;
  }

  private _getDaysBeforePrStaleUsedOptionName():
    | Option.DaysBeforeStale
    | Option.DaysBeforePrStale {
    return isNaN(this.options.daysBeforePrStale)
      ? Option.DaysBeforeStale
      : Option.DaysBeforePrStale;
  }
}
