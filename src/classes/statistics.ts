import {Issue} from './issue';
import {Logger} from './loggers/logger';
import {LoggerService} from '../services/logger.service';

interface IGroupValue {
  name: string;
  count: number;
}

export class Statistics {
  private readonly _logger: Logger = new Logger();
  processedIssuesCount = 0;
  processedPullRequestsCount = 0;
  staleIssuesCount = 0;
  stalePullRequestsCount = 0;
  undoStaleIssuesCount = 0;
  undoStalePullRequestsCount = 0;
  operationsCount = 0;
  closedIssuesCount = 0;
  closedPullRequestsCount = 0;
  deletedIssuesLabelsCount = 0;
  deletedPullRequestsLabelsCount = 0;
  deletedCloseIssuesLabelsCount = 0;
  deletedClosePullRequestsLabelsCount = 0;
  deletedBranchesCount = 0;
  addedIssuesLabelsCount = 0;
  addedPullRequestsLabelsCount = 0;
  addedIssuesCommentsCount = 0;
  addedPullRequestsCommentsCount = 0;
  fetchedItemsCount = 0;
  fetchedItemsEventsCount = 0;
  fetchedItemsCommentsCount = 0;
  fetchedPullRequestsCount = 0;

  incrementProcessedItemsCount(
    issue: Readonly<Issue>,
    increment: Readonly<number> = 1
  ): Statistics {
    if (issue.isPullRequest) {
      return this._incrementProcessedPullRequestsCount(increment);
    }

    return this._incrementProcessedIssuesCount(increment);
  }

  incrementStaleItemsCount(
    issue: Readonly<Issue>,
    increment: Readonly<number> = 1
  ): Statistics {
    if (issue.isPullRequest) {
      return this._incrementStalePullRequestsCount(increment);
    }

    return this._incrementStaleIssuesCount(increment);
  }

  incrementUndoStaleItemsCount(
    issue: Readonly<Issue>,
    increment: Readonly<number> = 1
  ): Statistics {
    if (issue.isPullRequest) {
      return this._incrementUndoStalePullRequestsCount(increment);
    }

    return this._incrementUndoStaleIssuesCount(increment);
  }

  setOperationsCount(operationsCount: Readonly<number>): Statistics {
    this.operationsCount = operationsCount;

    return this;
  }

  incrementClosedItemsCount(
    issue: Readonly<Issue>,
    increment: Readonly<number> = 1
  ): Statistics {
    if (issue.isPullRequest) {
      return this._incrementClosedPullRequestsCount(increment);
    }

    return this._incrementClosedIssuesCount(increment);
  }

  incrementDeletedItemsLabelsCount(
    issue: Readonly<Issue>,
    increment: Readonly<number> = 1
  ): Statistics {
    if (issue.isPullRequest) {
      return this._incrementDeletedPullRequestsLabelsCount(increment);
    }

    return this._incrementDeletedIssuesLabelsCount(increment);
  }

  incrementDeletedCloseItemsLabelsCount(
    issue: Readonly<Issue>,
    increment: Readonly<number> = 1
  ): Statistics {
    if (issue.isPullRequest) {
      return this._incrementDeletedClosePullRequestsLabelsCount(increment);
    }

    return this._incrementDeletedCloseIssuesLabelsCount(increment);
  }

  incrementDeletedBranchesCount(increment: Readonly<number> = 1): Statistics {
    this.deletedBranchesCount += increment;

    return this;
  }

  incrementAddedItemsLabel(
    issue: Readonly<Issue>,
    increment: Readonly<number> = 1
  ): Statistics {
    if (issue.isPullRequest) {
      return this._incrementAddedPullRequestsLabel(increment);
    }

    return this._incrementAddedIssuesLabel(increment);
  }

  incrementAddedItemsComment(
    issue: Readonly<Issue>,
    increment: Readonly<number> = 1
  ): Statistics {
    if (issue.isPullRequest) {
      return this._incrementAddedPullRequestsComment(increment);
    }

    return this._incrementAddedIssuesComment(increment);
  }

  incrementFetchedItemsCount(increment: Readonly<number> = 1): Statistics {
    this.fetchedItemsCount += increment;

    return this;
  }

  incrementFetchedItemsEventsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.fetchedItemsEventsCount += increment;

    return this;
  }

  incrementFetchedItemsCommentsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.fetchedItemsCommentsCount += increment;

    return this;
  }

  incrementFetchedPullRequestsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.fetchedPullRequestsCount += increment;

    return this;
  }

  logStats(): Statistics {
    this._logger.info(LoggerService.yellow(LoggerService.bold(`Statistics:`)));
    this._logProcessedIssuesAndPullRequestsCount();
    this._logStaleIssuesAndPullRequestsCount();
    this._logUndoStaleIssuesAndPullRequestsCount();
    this._logClosedIssuesAndPullRequestsCount();
    this._logDeletedIssuesAndPullRequestsLabelsCount();
    this._logDeletedCloseIssuesAndPullRequestsLabelsCount();
    this._logDeletedBranchesCount();
    this._logAddedIssuesAndPullRequestsLabelsCount();
    this._logAddedIssuesAndPullRequestsCommentsCount();
    this._logFetchedItemsCount();
    this._logFetchedItemsEventsCount();
    this._logFetchedItemsCommentsCount();
    this._logFetchedPullRequestsCount();
    this._logOperationsCount();

    return this;
  }

  private _incrementProcessedIssuesCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.processedIssuesCount += increment;

    return this;
  }

  private _incrementProcessedPullRequestsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.processedPullRequestsCount += increment;

    return this;
  }

  private _incrementStaleIssuesCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.staleIssuesCount += increment;

    return this;
  }

  private _incrementStalePullRequestsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.stalePullRequestsCount += increment;

    return this;
  }

  private _incrementUndoStaleIssuesCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.undoStaleIssuesCount += increment;

    return this;
  }

  private _incrementUndoStalePullRequestsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.undoStalePullRequestsCount += increment;

    return this;
  }

  private _incrementClosedIssuesCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.closedIssuesCount += increment;

    return this;
  }

  private _incrementClosedPullRequestsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.closedPullRequestsCount += increment;

    return this;
  }

  private _incrementDeletedIssuesLabelsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.deletedIssuesLabelsCount += increment;

    return this;
  }

  private _incrementDeletedPullRequestsLabelsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.deletedPullRequestsLabelsCount += increment;

    return this;
  }

  private _incrementDeletedCloseIssuesLabelsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.deletedCloseIssuesLabelsCount += increment;

    return this;
  }

  private _incrementDeletedClosePullRequestsLabelsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this.deletedClosePullRequestsLabelsCount += increment;

    return this;
  }

  private _incrementAddedIssuesLabel(
    increment: Readonly<number> = 1
  ): Statistics {
    this.addedIssuesLabelsCount += increment;

    return this;
  }

  private _incrementAddedPullRequestsLabel(
    increment: Readonly<number> = 1
  ): Statistics {
    this.addedPullRequestsLabelsCount += increment;

    return this;
  }

  private _incrementAddedIssuesComment(
    increment: Readonly<number> = 1
  ): Statistics {
    this.addedIssuesCommentsCount += increment;

    return this;
  }

  private _incrementAddedPullRequestsComment(
    increment: Readonly<number> = 1
  ): Statistics {
    this.addedPullRequestsCommentsCount += increment;

    return this;
  }

  private _logProcessedIssuesAndPullRequestsCount(): void {
    this._logGroup('Processed items', [
      {
        name: 'Processed issues',
        count: this.processedIssuesCount
      },
      {
        name: 'Processed PRs',
        count: this.processedPullRequestsCount
      }
    ]);
  }

  private _logStaleIssuesAndPullRequestsCount(): void {
    this._logGroup('New stale items', [
      {
        name: 'New stale issues',
        count: this.staleIssuesCount
      },
      {
        name: 'New stale PRs',
        count: this.stalePullRequestsCount
      }
    ]);
  }

  private _logUndoStaleIssuesAndPullRequestsCount(): void {
    this._logGroup('No longer stale items', [
      {
        name: 'No longer stale issues',
        count: this.undoStaleIssuesCount
      },
      {
        name: 'No longer stale PRs',
        count: this.undoStalePullRequestsCount
      }
    ]);
  }

  private _logClosedIssuesAndPullRequestsCount(): void {
    this._logGroup('Closed items', [
      {
        name: 'Closed issues',
        count: this.closedIssuesCount
      },
      {
        name: 'Closed PRs',
        count: this.closedPullRequestsCount
      }
    ]);
  }

  private _logDeletedIssuesAndPullRequestsLabelsCount(): void {
    this._logGroup('Deleted items labels', [
      {
        name: 'Deleted issues labels',
        count: this.deletedIssuesLabelsCount
      },
      {
        name: 'Deleted PRs labels',
        count: this.deletedPullRequestsLabelsCount
      }
    ]);
  }

  private _logDeletedCloseIssuesAndPullRequestsLabelsCount(): void {
    this._logGroup('Deleted close items labels', [
      {
        name: 'Deleted close issues labels',
        count: this.deletedCloseIssuesLabelsCount
      },
      {
        name: 'Deleted close PRs labels',
        count: this.deletedClosePullRequestsLabelsCount
      }
    ]);
  }

  private _logDeletedBranchesCount(): void {
    this._logCount('Deleted branches', this.deletedBranchesCount);
  }

  private _logAddedIssuesAndPullRequestsLabelsCount(): void {
    this._logGroup('Added items labels', [
      {
        name: 'Added issues labels',
        count: this.addedIssuesLabelsCount
      },
      {
        name: 'Added PRs labels',
        count: this.addedPullRequestsLabelsCount
      }
    ]);
  }

  private _logAddedIssuesAndPullRequestsCommentsCount(): void {
    this._logGroup('Added items comments', [
      {
        name: 'Added issues comments',
        count: this.addedIssuesCommentsCount
      },
      {
        name: 'Added PRs comments',
        count: this.addedPullRequestsCommentsCount
      }
    ]);
  }

  private _logFetchedItemsCount(): void {
    this._logCount('Fetched items', this.fetchedItemsCount);
  }

  private _logFetchedItemsEventsCount(): void {
    this._logCount('Fetched items events', this.fetchedItemsEventsCount);
  }

  private _logFetchedItemsCommentsCount(): void {
    this._logCount('Fetched items comments', this.fetchedItemsCommentsCount);
  }

  private _logFetchedPullRequestsCount(): void {
    this._logCount('Fetched pull requests', this.fetchedPullRequestsCount);
  }

  private _logOperationsCount(): void {
    this._logCount('Operations performed', this.operationsCount);
  }

  private _logCount(name: Readonly<string>, count: Readonly<number>): void {
    if (count > 0) {
      this._logger.info(`${name}:`, LoggerService.cyan(count));
    }
  }

  private _logGroup(groupName: Readonly<string>, values: IGroupValue[]): void {
    if (this._isGroupValuesPartiallySet(values)) {
      this._logCount(groupName, this._getGroupValuesTotalCount(values));

      this._logGroupValues(values);
    } else {
      // Only one value will be display
      for (const value of values) {
        this._logCount(value.name, value.count);
      }
    }
  }

  /**
   * @private
   * @description
   * If there is a least two elements with a valid count then it's partially set
   * Useful to defined if we should display the values as a group or not
   *
   * @param {IGroupValue[]} values The list of group values to check
   */
  private _isGroupValuesPartiallySet(values: IGroupValue[]): boolean {
    return (
      values
        .map((value: Readonly<IGroupValue>): boolean => {
          return value.count > 0;
        })
        .filter((isSet: Readonly<boolean>): boolean => isSet).length >= 2
    );
  }

  private _getGroupValuesTotalCount(values: IGroupValue[]): number {
    return values.reduce(
      (count: Readonly<number>, value: Readonly<IGroupValue>): number => {
        return count + value.count;
      },
      0
    );
  }

  private _getAllGroupValuesSet(values: IGroupValue[]): IGroupValue[] {
    return values.filter((value: Readonly<IGroupValue>): boolean => {
      return value.count > 0;
    });
  }

  private _logGroupValues(values: IGroupValue[]): void {
    const onlyValuesSet: IGroupValue[] = this._getAllGroupValuesSet(values);
    const longestValue: number = this._getLongestGroupValue(onlyValuesSet);

    for (const [index, value] of onlyValuesSet.entries()) {
      const prefix = index === onlyValuesSet.length - 1 ? '└──' : '├──';

      this._logCount(
        `${LoggerService.white(prefix)} ${value.name.padEnd(
          longestValue,
          ' '
        )}`,
        value.count
      );
    }
  }

  private _getLongestGroupValue(values: IGroupValue[]): number {
    return values.reduce(
      (
        longestValue: Readonly<number>,
        value: Readonly<IGroupValue>
      ): number => {
        return value.name.length > longestValue
          ? value.name.length
          : longestValue;
      },
      0
    );
  }
}
