import {IStateStorage} from '../../interfaces/state/state-storage';
import fs from 'fs';
import path from 'path';
import os from 'os';
import * as core from '@actions/core';
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

export class StateCacheStorage implements IStateStorage {
  async save(serializedState: string): Promise<void> {
    const tmpDir = mkTempDir();
    const filePath = path.join(tmpDir, STATE_FILE);
    fs.writeFileSync(filePath, serializedState);

    try {
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
      const cacheExists = await cache.restoreCache(
        [path.dirname(filePath)],
        CACHE_KEY
      );
      if (!cacheExists) {
        core.info(
          'The saved state was not found, the process starts from the first issue.'
        );
        return '';
      }

      if (!fs.existsSync(filePath)) {
        core.warning(
          'Unknown error when unpacking the cache, the process starts from the first issue.'
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
