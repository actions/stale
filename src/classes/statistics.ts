import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Logger} from './loggers/logger';

export class Statistics {
  private readonly _logger: Logger = new Logger();
  private readonly _options: IIssuesProcessorOptions;
  private _processedIssuesCount = 0;
  private _operationsCount = 0;

  constructor(options: IIssuesProcessorOptions) {
    this._options = options;
  }

  incrementProcessedIssuesCount(increment: Readonly<number> = 1): Statistics {
    this._processedIssuesCount += increment;

    return this;
  }

  setOperationsLeft(operationsLeft: Readonly<number>): Statistics {
    this._operationsCount = this._options.operationsPerRun - operationsLeft;

    return this;
  }

  logStats(): Statistics {
    this._logger.info('Statistics');
    this._logProcessedIssuesCount();
    this._logOperationsCount();
    this._logger.info('---');

    return this;
  }

  private _logProcessedIssuesCount(): void {
    this._logCount('Processed issues/PRs', this._processedIssuesCount);
  }

  private _logOperationsCount(): void {
    this._logCount('GitHub operations consumed', this._operationsCount);
  }

  private _logCount(name: Readonly<string>, count: Readonly<number>): void {
    if (count > 0) {
      this._logger.info(`${name}: ${count}`);
    }
  }
}
