import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Issue} from './issue';
import {Logger} from './loggers/logger';

interface IGroupValue {
  name: string;
  count: number;
}

export class Statistics {
  private readonly _logger: Logger = new Logger();
  private readonly _options: IIssuesProcessorOptions;
  private _processedIssuesCount = 0;
  private _processedPullRequestsCount = 0;
  private _staleIssuesCount = 0;
  private _stalePullRequestsCount = 0;
  private _undoStaleIssuesCount = 0;
  private _undoStalePullRequestsCount = 0;
  private _operationsCount = 0;
  private _closedIssuesCount = 0;
  private _closedPullRequestsCount = 0;
  private _deletedLabelsCount = 0;
  private _deletedCloseLabelsCount = 0;
  private _deletedBranchesCount = 0;
  private _addedLabelsCount = 0;
  private _addedCommentsCount = 0;
  private _fetchedIssuesCount = 0;
  private _fetchedIssuesEventsCount = 0;
  private _fetchedIssuesCommentsCount = 0;
  private _fetchedPullRequestsCount = 0;

  constructor(options: IIssuesProcessorOptions) {
    this._options = options;
  }

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

  setOperationsLeft(operationsLeft: Readonly<number>): Statistics {
    this._operationsCount = this._options.operationsPerRun - operationsLeft;

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

  incrementDeletedLabelsCount(increment: Readonly<number> = 1): Statistics {
    this._deletedLabelsCount += increment;

    return this;
  }

  incrementDeletedCloseLabelsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._deletedCloseLabelsCount += increment;

    return this;
  }

  incrementDeletedBranchesCount(increment: Readonly<number> = 1): Statistics {
    this._deletedBranchesCount += increment;

    return this;
  }

  incrementAddedLabel(increment: Readonly<number> = 1): Statistics {
    this._addedLabelsCount += increment;

    return this;
  }

  incrementAddedComment(increment: Readonly<number> = 1): Statistics {
    this._addedCommentsCount += increment;

    return this;
  }

  incrementFetchedIssuesCount(increment: Readonly<number> = 1): Statistics {
    this._fetchedIssuesCount += increment;

    return this;
  }

  incrementFetchedIssuesEventsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._fetchedIssuesEventsCount += increment;

    return this;
  }

  incrementFetchedIssuesCommentsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._fetchedIssuesCommentsCount += increment;

    return this;
  }

  incrementFetchedPullRequestsCount(
    increment: Readonly<number> = 1
  ): Statistics {
    this._fetchedPullRequestsCount += increment;

    return this;
  }

  logStats(): Statistics {
    this._logger.info('Statistics');
    this._logProcessedIssuesAndPullRequestsCount();
    this._logStaleIssuesAndPullRequestsCount();
    this._logUndoStaleIssuesAndPullRequestsCount();
    this._logClosedIssuesAndPullRequestsCount();
    this._logDeletedLabelsCount();
    this._logDeletedCloseLabelsCount();
    this._logDeletedBranchesCount();
    this._logAddedLabelsCount();
    this._logAddedCommentsCount();
    this._logFetchedIssuesCount();
    this._logFetchedIssuesEventsCount();
    this._logFetchedIssuesCommentsCount();
    this._logFetchedPullRequestsCount();
    this._logOperationsCount();
    this._logger.info('---');

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

  private _logDeletedLabelsCount(): void {
    this._logCount('Deleted labels', this._deletedLabelsCount);
  }

  private _logDeletedCloseLabelsCount(): void {
    this._logCount('Deleted close labels', this._deletedCloseLabelsCount);
  }

  private _logDeletedBranchesCount(): void {
    this._logCount('Deleted branches', this._deletedBranchesCount);
  }

  private _logAddedLabelsCount(): void {
    this._logCount('Added labels', this._addedLabelsCount);
  }

  private _logAddedCommentsCount(): void {
    this._logCount('Added comments', this._addedCommentsCount);
  }

  private _logFetchedIssuesCount(): void {
    this._logCount('Fetched issues', this._fetchedIssuesCount);
  }

  private _logFetchedIssuesEventsCount(): void {
    this._logCount('Fetched issues events', this._fetchedIssuesEventsCount);
  }

  private _logFetchedIssuesCommentsCount(): void {
    this._logCount('Fetched issues comments', this._fetchedIssuesCommentsCount);
  }

  private _logFetchedPullRequestsCount(): void {
    this._logCount('Fetched pull requests', this._fetchedPullRequestsCount);
  }

  private _logOperationsCount(): void {
    this._logCount('Operations performed', this._operationsCount);
  }

  private _logCount(name: Readonly<string>, count: Readonly<number>): void {
    if (count > 0) {
      this._logger.info(`${name}: ${count}`);
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
        `${prefix} ${value.name.padEnd(longestValue, ' ')}`,
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
