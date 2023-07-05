import fs from 'fs';
import * as core from '@actions/core';
import * as cache from '@actions/cache';
import {getOctokit} from '@actions/github';
import {retry as octokitRetry} from '@octokit/plugin-retry';
import path from 'path';

const resetCacheWithOctokit = async (cacheKey: string): Promise<void> => {
  const token = core.getInput('repo-token');
  const client = getOctokit(token, undefined, octokitRetry);
  // TODO: better way to get repository?
  const repo = process.env['GITHUB_REPOSITORY'];
  core.debug(`remove cache "${cacheKey}"`);
  try {
    // TODO: replace with client.rest.
    await client.request(
      `DELETE /repos/${repo}/actions/caches?key=${cacheKey}`
    );
  } catch (error) {
    if (error.status) {
      core.debug(`Cache ${cacheKey} does not exist`);
    } else {
      throw error;
    }
  }
};
export const uploadFileToActionsCache = async (
  filePath: string,
  cacheKey: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cacheVersion: string
) => {
  await resetCacheWithOctokit(cacheKey);
  const fileSize = fs.statSync(filePath).size;

  if (fileSize === 0) {
    core.info(`the cache ${cacheKey} will be removed`);
    return;
  }

  core.debug('content: ' + fs.readFileSync(filePath).toString());
  cache.saveCache([path.dirname(filePath)], cacheKey);
};
