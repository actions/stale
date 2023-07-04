import {IStateStorage} from '../../interfaces/state/state-storage';
import fs from 'fs';
import path from 'path';
import os from 'os';
import * as core from '@actions/core';
import {uploadFileToActionsCache} from '../actions-cache/upload';
import {downloadFileFromActionsCache} from '../actions-cache/download';

const CACHE_KEY = '_state';
const CACHE_VERSION = '1';
const STATE_FILE = 'state.txt';
export class StateCacheStorage implements IStateStorage {
  async save(serializedState: string): Promise<void> {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'state-'));
    const file = path.join(tmpDir, STATE_FILE);
    fs.writeFileSync(file, serializedState);

    try {
      await uploadFileToActionsCache(file, CACHE_KEY, CACHE_VERSION);
    } catch (error) {
      core.warning(
        `Saving the state was not successful due to "${
          error.message || 'unknown reason'
        }"`
      );
    }
  }

  async restore(): Promise<string> {
    const tmpDir = fs.mkdtempSync('state-');
    const fileName = path.join(tmpDir, STATE_FILE);
    try {
      await downloadFileFromActionsCache(fileName, CACHE_KEY, CACHE_VERSION);
      if (!fs.existsSync(fileName)) {
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
