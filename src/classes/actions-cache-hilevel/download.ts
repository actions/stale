import * as cache from '@actions/cache';
import path from 'path';

export const downloadFileFromActionsCache = (
  destFileName: string,
  cacheKey: string,
  cacheVersion: string
): Promise<void> =>
  cache.restoreCache([path.dirname(destFileName)], cacheKey) as Promise<void>;
