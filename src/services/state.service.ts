import * as crypto from 'crypto';
import {IState} from '../interfaces/state/state';
import {State} from '../classes/state/state';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {StateCacheStorage} from '../classes/state/state-cache-storage';

function sha256(message: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(message);
  return hash.digest('hex');
}

export const getStateInstance = (options: IIssuesProcessorOptions): IState => {
  const json = JSON.stringify(options, (key, value) =>
    key === 'repoToken' ? undefined : value
  );
  const cacheKey = sha256(json);
  const storage = new StateCacheStorage(cacheKey);
  return new State(storage, options);
};
