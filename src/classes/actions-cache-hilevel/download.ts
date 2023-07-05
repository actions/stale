import * as cache from '@actions/cache';
import path from 'path';

export const downloadFileFromActionsCache = (
  destFileName: string,
  cacheKey: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cacheVersion: string
): Promise<void> =>
  cache.restoreCache([path.dirname(destFileName)], cacheKey, [
    cacheKey
  ]) as Promise<void>;
