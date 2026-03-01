import {IState} from '../interfaces/state/state';
import {State} from '../classes/state/state';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {StateCacheStorage} from '../classes/state/state-cache-storage';

export const getStateInstance = (options: IIssuesProcessorOptions): IState => {
  const storage = new StateCacheStorage();
  return new State(storage, options);
};
