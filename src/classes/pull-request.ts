import {Issue} from './issue';

export class PullRequest extends Issue {
  get staleLabel(): string {
    return this._options.stalePrLabel;
  }

  get staleMessage(): string {
    return this._options.stalePrMessage;
  }

  get closeLabel(): string {
    return this._options.closePrLabel;
  }

  get closeMessage(): string {
    return this._options.closePrMessage;
  }

  get skipMessage(): boolean {
    return this._options.skipStalePrMessage;
  }

  get daysBeforeStale(): number {
    return isNaN(this._options.daysBeforePrStale)
      ? this._options.daysBeforeStale
      : this._options.daysBeforePrStale;
  }

  get daysBeforeClose(): number {
    return isNaN(this._options.daysBeforePrClose)
      ? this._options.daysBeforeClose
      : this._options.daysBeforePrClose;
  }
}
