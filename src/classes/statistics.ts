import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Logger} from './loggers/logger';

export class Statistics {
  private readonly _logger: Logger = new Logger();
  private readonly _options: IIssuesProcessorOptions;
  private _processedIssuesCount = 0;
  private _staleIssuesCount = 0;
  private _undoStaleIssuesCount = 0;
  private _operationsCount = 0;
  private _closedIssuesCount = 0;
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

  incrementProcessedIssuesCount(increment: Readonly<number> = 1): Statistics {
    this._processedIssuesCount += increment;

    return this;
  }

  incrementStaleIssuesCount(increment: Readonly<number> = 1): Statistics {
    this._staleIssuesCount += increment;

    return this;
  }

  incrementUndoStaleIssuesCount(increment: Readonly<number> = 1): Statistics {
    this._undoStaleIssuesCount += increment;

    return this;
  }

  setOperationsLeft(operationsLeft: Readonly<number>): Statistics {
    this._operationsCount = this._options.operationsPerRun - operationsLeft;

    return this;
  }

  incrementClosedIssuesCount(increment: Readonly<number> = 1): Statistics {
    this._closedIssuesCount += increment;

    return this;
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
    this._logProcessedIssuesCount();
    this._logStaleIssuesCount();
    this._logUndoStaleIssuesCount();
    this._logOperationsCount();
    this._logClosedIssuesCount();
    this._logDeletedLabelsCount();
    this._logDeletedCloseLabelsCount();
    this._logDeletedBranchesCount();
    this._logAddedLabelsCount();
    this._logAddedCommentsCount();
    this._logFetchedIssuesCount();
    this._logFetchedIssuesEventsCount();
    this._logFetchedIssuesCommentsCount();
    this._logFetchedPullRequestsCount();
    this._logger.info('---');

    return this;
  }

  private _logProcessedIssuesCount(): void {
    this._logCount('Processed issues/PRs', this._processedIssuesCount);
  }

  private _logStaleIssuesCount(): void {
    this._logCount('New stale issues/PRs', this._staleIssuesCount);
  }

  private _logUndoStaleIssuesCount(): void {
    this._logCount('No longer stale issues/PRs', this._undoStaleIssuesCount);
  }

  private _logOperationsCount(): void {
    this._logCount('Operations performed', this._operationsCount);
  }

  private _logClosedIssuesCount(): void {
    this._logCount('Closed issues', this._closedIssuesCount);
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

  private _logCount(name: Readonly<string>, count: Readonly<number>): void {
    if (count > 0) {
      this._logger.info(`${name}: ${count}`);
    }
  }
}
