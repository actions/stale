import {IStateStorage} from '../../interfaces/state/state-storage';
import fs from 'fs';
import path from 'path';
import os from 'os';
import * as core from '@actions/core';
import {getOctokit} from '@actions/github';
import {retry as octokitRetry} from '@octokit/plugin-retry';
import * as cache from '@actions/cache';

const CACHE_KEY = '_state';
const STATE_FILE = 'state.txt';
const STALE_DIR = '56acbeaa-1fef-4c79-8f84-7565e560fb03';

const mkTempDir = (): string => {
  const tmpDir = path.join(os.tmpdir(), STALE_DIR);
  fs.mkdirSync(tmpDir, {recursive: true});
  return tmpDir;
};

const unlinkSafely = (filePath: string) => {
  try {
    fs.unlinkSync(filePath);
  } catch (foo) {
    /* ignore */
  }
};

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
export class StateCacheStorage implements IStateStorage {
  async save(serializedState: string): Promise<void> {
    const tmpDir = mkTempDir();
    const filePath = path.join(tmpDir, STATE_FILE);
    fs.writeFileSync(filePath, serializedState);

    try {
      await resetCacheWithOctokit(CACHE_KEY);
      const fileSize = fs.statSync(filePath).size;

      if (fileSize === 0) {
        core.info(`the state will be removed`);
        return;
      }

      await cache.saveCache([path.dirname(filePath)], CACHE_KEY);
    } catch (error) {
      core.warning(
        `Saving the state was not successful due to "${
          error.message || 'unknown reason'
        }"`
      );
    } finally {
      unlinkSafely(filePath);
    }
  }

  async restore(): Promise<string> {
    const tmpDir = mkTempDir();
    const filePath = path.join(tmpDir, STATE_FILE);
    unlinkSafely(filePath);
    try {
      await cache.restoreCache([path.dirname(filePath)], CACHE_KEY);

      if (!fs.existsSync(filePath)) {
        core.info(
          'The stored state has not been found, probably because of the very first run or the previous run failed'
        );
        return '';
      }
      return fs.readFileSync(path.join(tmpDir, STATE_FILE), {
        encoding: 'utf8'
      });
    } catch (error) {
      core.warning(
        `Restoring the state was not successful due to "${
          error.message || 'unknown reason'
        }"`
      );
      return '';
    }
  }
}
