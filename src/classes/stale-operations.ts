import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Operations} from './operations';

export class StaleOperations extends Operations {
  private readonly _options: IIssuesProcessorOptions;

  constructor(options: Readonly<IIssuesProcessorOptions>) {
    super();
    this._options = options;
  }

  hasOperationsLeft(): boolean {
    return this._operationsConsumed < this._options.operationsPerRun;
  }

  getOperationsLeftCount(): number {
    return this._options.operationsPerRun - this._operationsConsumed;
  }
}
