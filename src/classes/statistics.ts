import chalk from 'chalk';
import {Issue} from './issue';
import {Logger} from './loggers/logger';

interface IGroupValue {
  name: string;
  count: number;
}

export class Statistics {
  private readonly _logger: Logger = new Logger();
  private _processedIssuesCount = 0;
  private _processedPullRequestsCount = 0;
  private _staleIssuesCount = 0;
  private _stalePullRequestsCount = 0;
  private _undoStaleIssuesCount = 0;
  private _undoStalePullRequestsCount = 0;
  private _operationsCount = 0;
  private _closedIssuesCount = 0;
  private _closedPullRequestsCount = 0;
  private _deletedIssuesLabelsCount = 0;
  private _deletedPullRequestsLabelsCount = 0;
  private _deletedCloseIssuesLabelsCount = 0;
  private _deletedClosePullRequestsLabelsCount = 0;
  private _deletedBranchesCount = 0;
  private _addedIssuesLabelsCount = 0;
  private _addedPullRequestsLabelsCount = 0;
  private _addedIssuesCommentsCount = 0;
  private _addedPullRequestsCommentsCount = 0;
  private _fetchedItemsCount = 0;
  private _fetchedItemsEventsCount = 0;
  private _fetchedItemsCommentsCount = 0;
  private _fetchedPullRequestsCount = 0;

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

  setRemainingOperations(remainingOperations: Readonly<number>): Statistics {
    this._operationsCount = remainingOperations;

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
    this._deletedBranchesCount += increment;

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
    this._fetchedItemsCount += increment;

    return this;
  }

  incrementFetchedItemsEventsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._fetchedItemsEventsCount += increment;

    return this;
  }

  incrementFetchedItemsCommentsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._fetchedItemsCommentsCount += increment;

    return this;
  }

  incrementFetchedPullRequestsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._fetchedPullRequestsCount += increment;

    return this;
  }

  logStats(): Statistics {
    this._logger.info(chalk.yellow.bold('Statistics:'));
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
    this._processedIssuesCount += increment;

    return this;
  }

  private _incrementProcessedPullRequestsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._processedPullRequestsCount += increment;

    return this;
  }

  private _incrementStaleIssuesCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._staleIssuesCount += increment;

    return this;
  }

  private _incrementStalePullRequestsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._stalePullRequestsCount += increment;

    return this;
  }

  private _incrementUndoStaleIssuesCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._undoStaleIssuesCount += increment;

    return this;
  }

  private _incrementUndoStalePullRequestsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._undoStalePullRequestsCount += increment;

    return this;
  }

  private _incrementClosedIssuesCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._closedIssuesCount += increment;

    return this;
  }

  private _incrementClosedPullRequestsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._closedPullRequestsCount += increment;

    return this;
  }

  private _incrementDeletedIssuesLabelsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._deletedIssuesLabelsCount += increment;

    return this;
  }

  private _incrementDeletedPullRequestsLabelsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._deletedPullRequestsLabelsCount += increment;

    return this;
  }

  private _incrementDeletedCloseIssuesLabelsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._deletedCloseIssuesLabelsCount += increment;

    return this;
  }

  private _incrementDeletedClosePullRequestsLabelsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._deletedClosePullRequestsLabelsCount += increment;

    return this;
  }

  private _incrementAddedIssuesLabel(
    increment: Readonly<number> = 1
  ): Statistics {
    this._addedIssuesLabelsCount += increment;

    return this;
  }

  private _incrementAddedPullRequestsLabel(
    increment: Readonly<number> = 1
  ): Statistics {
    this._addedPullRequestsLabelsCount += increment;

    return this;
  }

  private _incrementAddedIssuesComment(
    increment: Readonly<number> = 1
  ): Statistics {
    this._addedIssuesCommentsCount += increment;

    return this;
  }

  private _incrementAddedPullRequestsComment(
    increment: Readonly<number> = 1
  ): Statistics {
    this._addedPullRequestsCommentsCount += increment;

    return this;
  }

  private _logProcessedIssuesAndPullRequestsCount(): void {
    this._logGroup('Processed items', [
      {
        name: 'Processed issues',
        count: this._processedIssuesCount
      },
      {
        name: 'Processed PRs',
        count: this._processedPullRequestsCount
      }
    ]);
  }

  private _logStaleIssuesAndPullRequestsCount(): void {
    this._logGroup('New stale items', [
      {
        name: 'New stale issues',
        count: this._staleIssuesCount
      },
      {
        name: 'New stale PRs',
        count: this._stalePullRequestsCount
      }
    ]);
  }

  private _logUndoStaleIssuesAndPullRequestsCount(): void {
    this._logGroup('No longer stale items', [
      {
        name: 'No longer stale issues',
        count: this._undoStaleIssuesCount
      },
      {
        name: 'No longer stale PRs',
        count: this._undoStalePullRequestsCount
      }
    ]);
  }

  private _logClosedIssuesAndPullRequestsCount(): void {
    this._logGroup('Closed items', [
      {
        name: 'Closed issues',
        count: this._closedIssuesCount
      },
      {
        name: 'Closed PRs',
        count: this._closedPullRequestsCount
      }
    ]);
  }

  private _logDeletedIssuesAndPullRequestsLabelsCount(): void {
    this._logGroup('Deleted items labels', [
      {
        name: 'Deleted issues labels',
        count: this._deletedIssuesLabelsCount
      },
      {
        name: 'Deleted PRs labels',
        count: this._deletedPullRequestsLabelsCount
      }
    ]);
  }

  private _logDeletedCloseIssuesAndPullRequestsLabelsCount(): void {
    this._logGroup('Deleted close items labels', [
      {
        name: 'Deleted close issues labels',
        count: this._deletedCloseIssuesLabelsCount
      },
      {
        name: 'Deleted close PRs labels',
        count: this._deletedClosePullRequestsLabelsCount
      }
    ]);
  }

  private _logDeletedBranchesCount(): void {
    this._logCount('Deleted branches', this._deletedBranchesCount);
  }

  private _logAddedIssuesAndPullRequestsLabelsCount(): void {
    this._logGroup('Added items labels', [
      {
        name: 'Added issues labels',
        count: this._addedIssuesLabelsCount
      },
      {
        name: 'Added PRs labels',
        count: this._addedPullRequestsLabelsCount
      }
    ]);
  }

  private _logAddedIssuesAndPullRequestsCommentsCount(): void {
    this._logGroup('Added items comments', [
      {
        name: 'Added issues comments',
        count: this._addedIssuesCommentsCount
      },
      {
        name: 'Added PRs comments',
        count: this._addedPullRequestsCommentsCount
      }
    ]);
  }

  private _logFetchedItemsCount(): void {
    this._logCount('Fetched items', this._fetchedItemsCount);
  }

  private _logFetchedItemsEventsCount(): void {
    this._logCount('Fetched items events', this._fetchedItemsEventsCount);
  }

  private _logFetchedItemsCommentsCount(): void {
    this._logCount('Fetched items comments', this._fetchedItemsCommentsCount);
  }

  private _logFetchedPullRequestsCount(): void {
    this._logCount('Fetched pull requests', this._fetchedPullRequestsCount);
  }

  private _logOperationsCount(): void {
    this._logCount('Operations performed', this._operationsCount);
  }

  private _logCount(name: Readonly<string>, count: Readonly<number>): void {
    if (count > 0) {
      this._logger.info(`${name}:`, chalk.cyan(count));
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
        `${chalk.white(prefix)} ${value.name.padEnd(longestValue, ' ')}`,
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
