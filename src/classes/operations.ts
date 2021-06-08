export class Operations {
  protected _queryOperationsConsumed = 0;
  protected _mutationOperationsConsumed = 0;

  consumeQueryOperation(): Operations {
    return this.consumeQueryOperations(1);
  }

  consumeMutationOperation(): Operations {
    return this.consumeMutationOperations(1);
  }

  consumeQueryOperations(quantity: Readonly<number>): Operations {
    this._queryOperationsConsumed += quantity;

    return this;
  }

  consumeMutationOperations(quantity: Readonly<number>): Operations {
    this._mutationOperationsConsumed += quantity;

    return this;
  }

  getConsumedQueryOperationsCount(): number {
    return this._queryOperationsConsumed;
  }

  getConsumedMutationOperationsCount(): number {
    return this._mutationOperationsConsumed;
  }
}
