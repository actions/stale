import {IRateLimit, OctokitRateLimit} from '../interfaces/rate-limit';

export class RateLimit implements IRateLimit {
  readonly limit: number;
  readonly remaining: number;
  readonly reset: Date;
  readonly used: number;

  constructor(rateLimit: Readonly<OctokitRateLimit>) {
    this.limit = rateLimit.limit;
    this.remaining = rateLimit.remaining;
    this.used = rateLimit.used;
    this.reset = new Date(rateLimit.reset * 1000);
  }
}
