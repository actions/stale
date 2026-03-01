export class Operations {
  protected _operationsConsumed = 0;

  consumeOperation(): Operations {
    return this.consumeOperations(1);
  }

  consumeOperations(quantity: Readonly<number>): Operations {
    this._operationsConsumed += quantity;

    return this;
  }

  getConsumedOperationsCount(): number {
    return this._operationsConsumed;
  }
}
