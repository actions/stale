import {IStateStorage} from '../../interfaces/state/state-storage';
import fs from 'fs';
import path from 'path';
import os from 'os';
import * as core from '@actions/core';
import {context, getOctokit} from '@actions/github';
import {retry as octokitRetry} from '@octokit/plugin-retry';
import * as cache from '@actions/cache';
import {IIssuesProcessorOptions} from '../../interfaces/issues-processor-options';

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

const getOctokitClient = () => {
  const token = core.getInput('repo-token');
  return getOctokit(token, undefined, octokitRetry);
};

const checkIfCacheExists = async (cacheKey: string): Promise<boolean> => {
  const client = getOctokitClient();
  try {
    const issueResult = await client.request(
      `/repos/${context.repo.owner}/${context.repo.repo}/actions/caches`
    );
    const caches: Array<{key?: string}> =
      issueResult.data['actions_caches'] || [];
    return Boolean(caches.find(cache => cache['key'] === cacheKey));
  } catch (error) {
    core.debug(`Error checking if cache exist: ${error.message}`);
  }
  return false;
};
const resetCacheWithOctokit = async (cacheKey: string): Promise<void> => {
  const client = getOctokitClient();
  core.debug(`remove cache "${cacheKey}"`);
  try {
    // TODO: replace with client.rest.
    await client.request(
      `DELETE /repos/${context.repo.owner}/${context.repo.repo}/actions/caches?key=${cacheKey}`
    );
  } catch (error) {
    if (error.status) {
      core.warning(
        `Error delete ${cacheKey}: [${error.status}] ${
          error.message || 'Unknown reason'
        }`
      );
    } else {
      throw error;
    }
  }
};
export class StateCacheStorage implements IStateStorage {
  /**
   * @private don't mutate in the debug mode
   */
  private readonly statePrefix: string;

  constructor(options: IIssuesProcessorOptions) {
    this.statePrefix = options.cachePrefix;
  }

  async save(serializedState: string): Promise<void> {
    const tmpDir = mkTempDir();
    const stateFile = `${this.statePrefix}_${STATE_FILE}`;
    const filePath = path.join(tmpDir, stateFile);
    fs.writeFileSync(filePath, serializedState);

    try {
      const cacheKey = `${this.statePrefix}${CACHE_KEY}`;
      const cacheExists = await checkIfCacheExists(cacheKey);
      if (cacheExists) {
        await resetCacheWithOctokit(cacheKey);
      }
      const fileSize = fs.statSync(filePath).size;

      if (fileSize === 0) {
        core.info(`the state will be removed`);
        return;
      }

      await cache.saveCache([path.dirname(filePath)], cacheKey);
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
    const stateFile = `${this.statePrefix}_${STATE_FILE}`;
    const filePath = path.join(tmpDir, stateFile);
    unlinkSafely(filePath);
    try {
      const cacheKey = `${this.statePrefix}${CACHE_KEY}`;
      const cacheExists = await checkIfCacheExists(cacheKey);
      if (!cacheExists) {
        core.info(
          'The saved state was not found, the process starts from the first issue.'
        );
        return '';
      }

      await cache.restoreCache([path.dirname(filePath)], cacheKey);

      if (!fs.existsSync(filePath)) {
        core.warning(
          'Unknown error when unpacking the cache, the process starts from the first issue.'
        );
        return '';
      }
      return fs.readFileSync(path.join(tmpDir, stateFile), {
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
