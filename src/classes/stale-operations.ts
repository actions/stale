import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Operations} from './operations';

export class StaleOperations extends Operations {
  private readonly _options: IIssuesProcessorOptions;

  constructor(options: Readonly<IIssuesProcessorOptions>) {
    super();
    this._options = options;
  }

  hasRemainingQueryOperations(): boolean {
    return this._queryOperationsConsumed < this._options.queryOperationsPerRun;
  }

  hasRemainingMutationOperations(): boolean {
    return (
      this._mutationOperationsConsumed < this._options.mutationOperationsPerRun
    );
  }

  getRemainingQueryOperationsCount(): number {
    return this._options.queryOperationsPerRun - this._queryOperationsConsumed;
  }

  getRemainingMutationOperationsCount(): number {
    return (
      this._options.mutationOperationsPerRun - this._mutationOperationsConsumed
    );
  }
}
