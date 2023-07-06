import {IssueID, State} from './state';
import {IIssuesProcessorOptions} from '../../interfaces/issues-processor-options';
import {IIssue} from '../../interfaces/issue';
import {IState} from '../../interfaces/state/state';
import * as core from '@actions/core';

const mockStorage = {
  save: () => Promise.resolve(),
  restore: () => Promise.resolve('')
};

const getProcessedIssuesIDs = (state: IState): Set<IssueID> =>
  (state as unknown as {processedIssuesIDs: Set<IssueID>}).processedIssuesIDs;

describe('State', () => {
  let debugSpy: jest.SpyInstance;
  let infoSpy: jest.SpyInstance;
  let warningSpy: jest.SpyInstance;
  beforeEach(() => {
    debugSpy = jest.spyOn(core, 'debug');
    infoSpy = jest.spyOn(core, 'info');
    warningSpy = jest.spyOn(core, 'warning');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe('initializing and resetting', () => {
    it('new state should not contain any issues marked as proceeded', async () => {
      const state = new State(
        mockStorage,
        {} as unknown as IIssuesProcessorOptions
      );
      expect(getProcessedIssuesIDs(state)).toEqual(new Set());
      expect(debugSpy).not.toHaveBeenCalled();
    });
    it('reset state should not contain any issues marked as proceeded', async () => {
      const state = new State(
        mockStorage,
        {} as unknown as IIssuesProcessorOptions
      );
      state.addIssueToProcessed({number: 1} as unknown as IIssue);
      expect(getProcessedIssuesIDs(state)).not.toEqual(new Set());
      state.reset();
      expect(getProcessedIssuesIDs(state)).toEqual(new Set());
      expect(debugSpy).toHaveBeenCalledTimes(2);
      expect(debugSpy).toHaveBeenCalledWith('state: reset');
    });
  });
  describe('marking as proceeded', () => {
    it('state marked with issues 1,2,3 as proceeded should report the as proceeded', async () => {
      const state = new State(
        mockStorage,
        {} as unknown as IIssuesProcessorOptions
      );
      state.addIssueToProcessed({number: 1} as unknown as IIssue);
      state.addIssueToProcessed({number: 2} as unknown as IIssue);
      state.addIssueToProcessed({number: 3} as unknown as IIssue);
      expect(getProcessedIssuesIDs(state)).toEqual(new Set([1, 2, 3]));
      expect(
        state.isIssueProcessed({number: 1} as unknown as IIssue)
      ).toBeTruthy();
      expect(
        state.isIssueProcessed({number: 2} as unknown as IIssue)
      ).toBeTruthy();
      expect(
        state.isIssueProcessed({number: 3} as unknown as IIssue)
      ).toBeTruthy();
      expect(
        state.isIssueProcessed({number: 0} as unknown as IIssue)
      ).toBeFalsy();
      expect(
        state.isIssueProcessed({number: 4} as unknown as IIssue)
      ).toBeFalsy();
      expect(debugSpy).toHaveBeenCalledTimes(3);
      expect(debugSpy).toHaveBeenCalledWith('state: mark 1 as processed');
      expect(debugSpy).toHaveBeenCalledWith('state: mark 2 as processed');
      expect(debugSpy).toHaveBeenCalledWith('state: mark 3 as processed');
    });
  });
  describe('persisting', () => {
    it('[1,2,3] should be serialized and persisted as to "1|2|3|', async () => {
      const mockStorage = {
        save: jest.fn().mockReturnValue(Promise.resolve()),
        async restore(): Promise<string> {
          return '';
        }
      };
      const state = new State(
        mockStorage,
        {} as unknown as IIssuesProcessorOptions
      );
      state.addIssueToProcessed({number: 1} as unknown as IIssue);
      state.addIssueToProcessed({number: 2} as unknown as IIssue);
      state.addIssueToProcessed({number: 3} as unknown as IIssue);
      await state.persist();
      expect(mockStorage.save).toHaveBeenCalledTimes(1);
      expect(mockStorage.save).toHaveBeenCalledWith('1|2|3');
      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledWith(
        'state: persisting info about 3 issue(s)'
      );
    });
  });
  describe('rehydrating', () => {
    it('"1|2|3" should be rehydrate to the IState with issues 1,2,3 marked as proceeded', async () => {
      const mockStorage = {
        save: () => Promise.resolve(),
        restore: () => Promise.resolve('1|2|3')
      };
      const state = new State(
        mockStorage,
        {} as unknown as IIssuesProcessorOptions
      );
      await state.restore();
      const processedIssuesIDs = (
        state as unknown as {processedIssuesIDs: Set<IssueID>}
      ).processedIssuesIDs;
      expect(processedIssuesIDs).toEqual(new Set([1, 2, 3]));
      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledWith(
        'state: restored with info about 3 issue(s)'
      );
    });
  });
  describe('debugOnly', () => {
    it('state should persisted if debugOnly not set', () => {
      const mockStorage = {
        save: jest.fn().mockReturnValue(Promise.resolve()),
        async restore(): Promise<string> {
          return '';
        }
      };
      const state = new State(
        mockStorage,
        {} as unknown as IIssuesProcessorOptions
      );
      state.persist();
      expect(mockStorage.save).toHaveBeenCalledTimes(1);
    });
    it('state should not be persisted if debugOnly set true', () => {
      const mockStorage = {
        save: jest.fn().mockReturnValue(Promise.resolve()),
        async restore(): Promise<string> {
          return '';
        }
      };
      const state = new State(mockStorage, {
        debugOnly: true
      } as unknown as IIssuesProcessorOptions);
      state.persist();
      expect(mockStorage.save).not.toHaveBeenCalled();
      expect(warningSpy).toHaveBeenCalledTimes(1);
      expect(warningSpy).toHaveBeenCalledWith(
        'The state is not persisted in the debug mode'
      );
    });
  });
});
