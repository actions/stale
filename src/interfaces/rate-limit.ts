import {components} from '@octokit/openapi-types';

export interface IRateLimit {
  limit: number;
  used: number;
  remaining: number;
  reset: Date;
}

export type OctokitRateLimit = components['schemas']['rate-limit'];
