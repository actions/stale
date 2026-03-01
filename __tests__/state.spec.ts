import {IStateStorage} from '../src/interfaces/state/state-storage';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {Issue} from '../src/classes/issue';
import {generateIssue} from './functions/generate-issue';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {IssueID, State} from '../src/classes/state/state';
import {IState} from '../src/interfaces/state/state';
import * as core from '@actions/core';

const stateStorage: IStateStorage = {
  restore(): Promise<string> {
    return Promise.resolve('');
  },
  save(serializedState: string): Promise<void> {
    return Promise.resolve();
  }
};

const getProcessedIssuesIDs = (state: IState): Set<IssueID> =>
  (state as unknown as {processedIssuesIDs: Set<IssueID>}).processedIssuesIDs;

describe('state', (): void => {
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

  it('rehydrate/persist should not be called during processing', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      daysBeforeClose: 0
    };
    const TestIssueList: Issue[] = [
      generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
    ];
    const state = new State(stateStorage, opts);
    const restoreSpy = jest.spyOn(stateStorage, 'restore');
    const saveSpy = jest.spyOn(stateStorage, 'save');
    const processor = new IssuesProcessorMock(
      opts,
      state,
      async p => (p === 1 ? TestIssueList : []),
      async () => [],
      async () => new Date().toDateString()
    );

    await processor.processIssues(1);
    expect(restoreSpy).toHaveBeenCalledTimes(0);
    expect(saveSpy).toHaveBeenCalledTimes(0);
  });

  it('state should be marked with the processed issue', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      daysBeforeClose: 0
    };
    const testIssue1 = generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z'
    );
    const TestIssueList: Issue[] = [testIssue1];
    const state = new State(stateStorage, opts);
    const addIssueToProcessedSpy = jest.spyOn(state, 'addIssueToProcessed');
    const processor = new IssuesProcessorMock(
      opts,
      state,
      async p => (p === 1 ? TestIssueList : []),
      async () => [],
      async () => new Date().toDateString()
    );

    await processor.processIssues(1);
    expect(addIssueToProcessedSpy).toHaveBeenCalledTimes(1);
    expect(addIssueToProcessedSpy).toHaveBeenCalledWith(testIssue1);

    expect(debugSpy).toHaveBeenCalledWith('state: reset');
    expect(debugSpy).toHaveBeenCalledWith('state: mark 1 as processed');
  });

  it('issueProcessor should skip the issue marked as proceeded', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      daysBeforeClose: 0
    };
    const testIssue1 = generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z'
    );
    const testIssue2 = generateIssue(
      opts,
      2,
      'An issue with no label',
      '2020-01-01T17:00:00Z'
    );
    const TestIssueList: Issue[] = [testIssue1, testIssue2];
    const state = new State(stateStorage, opts);
    state.addIssueToProcessed(testIssue1);
    debugSpy.mockClear();
    const addIssueToProcessedSpy = jest.spyOn(state, 'addIssueToProcessed');
    const isIssueProcessedSpy = jest.spyOn(state, 'isIssueProcessed');
    const processor = new IssuesProcessorMock(
      opts,
      state,
      async p => (p === 1 ? TestIssueList : []),
      async () => [],
      async () => new Date().toDateString()
    );

    await processor.processIssues(1);
    expect(addIssueToProcessedSpy).toHaveBeenCalledTimes(1);
    expect(addIssueToProcessedSpy).toHaveBeenCalledWith(testIssue2);
    expect(isIssueProcessedSpy).toHaveBeenCalledTimes(2);
    expect(isIssueProcessedSpy).toHaveBeenCalledWith(testIssue1);
    expect(isIssueProcessedSpy).toHaveBeenCalledWith(testIssue2);
    expect(processor.staleIssues.length).toStrictEqual(1);
    expect(processor.closedIssues.length).toStrictEqual(1);

    expect(debugSpy).toHaveBeenCalledWith('state: reset');
    expect(debugSpy).toHaveBeenCalledWith('state: mark 2 as processed');
  });

  it('state should not be reset if not all issues are proceeded', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      operationsPerRun: 1,
      daysBeforeClose: 0
    };
    const testIssue1 = generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z'
    );
    const testIssue2 = generateIssue(
      opts,
      2,
      'An issue with no label',
      '2020-01-01T17:00:00Z'
    );
    const TestIssueList: Issue[] = [testIssue1, testIssue2];
    const state = new State(stateStorage, opts);
    const resetSpy = jest.spyOn(state, 'reset');
    const processor = new IssuesProcessorMock(
      opts,
      state,
      async p => (p === 1 ? TestIssueList : []),
      async () => [],
      async () => new Date().toDateString()
    );

    await processor.processIssues(1);
    // make sure not all issues are proceeded
    expect(warningSpy.mock.calls[2][0]).toContain(
      'No more operations left! Exiting...'
    );

    expect(resetSpy).toHaveBeenCalledTimes(0);
    expect(debugSpy).toHaveBeenCalledWith('state: mark 1 as processed');
  });

  it('state should be reset if all issues are proceeded', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      daysBeforeClose: 0
    };
    const testIssue1 = generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z'
    );
    const testIssue2 = generateIssue(
      opts,
      2,
      'An issue with no label',
      '2020-01-01T17:00:00Z'
    );
    const TestIssueList: Issue[] = [testIssue1, testIssue2];
    const state = new State(stateStorage, opts);
    const resetSpy = jest.spyOn(state, 'reset');
    const processor = new IssuesProcessorMock(
      opts,
      state,
      async p => (p === 1 ? TestIssueList : []),
      async () => [],
      async () => new Date().toDateString()
    );

    await processor.processIssues(1);
    // make sure all issues are proceeded
    expect(infoSpy.mock.calls[71][0]).toContain(
      'No more issues found to process. Exiting...'
    );

    expect(resetSpy).toHaveBeenCalledTimes(1);
    expect(debugSpy).toHaveBeenCalledWith('state: mark 1 as processed');
    expect(debugSpy).toHaveBeenCalledWith('state: mark 2 as processed');
  });
});
