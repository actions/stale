import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';

export class Operations {
  private readonly _options: IIssuesProcessorOptions;
  private _operationsLeft;

  constructor(options: Readonly<IIssuesProcessorOptions>) {
    this._options = options;
    this._operationsLeft = this._options.operationsPerRun;
  }

  consumeOperation(): Operations {
    return this.consumeOperations(1);
  }

  consumeOperations(quantity: Readonly<number>): Operations {
    this._operationsLeft -= quantity;

    return this;
  }

  getUnconsumedOperationsCount(): number {
    return this._options.operationsPerRun - this._operationsLeft;
  }

  hasOperationsLeft(): boolean {
    return this._operationsLeft <= 0;
  }

  getOperationsLeftCount(): number {
    return this._operationsLeft;
  }
}
