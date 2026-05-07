import {Issue} from '../src/classes/issue';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';
import {alwaysFalseStateMock} from './classes/state-mock';
import * as core from '@actions/core';

describe('only-issue-types option', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should only process issues with allowed type', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      onlyIssueTypes: 'bug,question'
    };
    const TestIssueList: Issue[] = [
      generateIssue(
        opts,
        1,
        'A bug',
        '2020-01-01T17:00:00Z',
        '2020-01-01T17:00:00Z',
        false,
        false,
        [],
        false,
        false,
        undefined,
        [],
        'bug'
      ),
      generateIssue(
        opts,
        2,
        'A feature',
        '2020-01-01T17:00:00Z',
        '2020-01-01T17:00:00Z',
        false,
        false,
        [],
        false,
        false,
        undefined,
        [],
        'feature'
      ),
      generateIssue(
        opts,
        3,
        'A question',
        '2020-01-01T17:00:00Z',
        '2020-01-01T17:00:00Z',
        false,
        false,
        [],
        false,
        false,
        undefined,
        [],
        'question'
      )
    ];
    const processor = new IssuesProcessorMock(
      opts,
      alwaysFalseStateMock,
      async p => (p === 1 ? TestIssueList : []),
      async () => [],
      async () => new Date().toDateString()
    );
    await processor.processIssues(1);
    expect(processor.staleIssues.map(i => i.title)).toEqual([
      'A bug',
      'A question'
    ]);
  });
  test('should process allowed issue types and skip PRs without logs', async () => {
    const infoSpy = jest.spyOn(core, 'info');
    const groupSpy = jest.spyOn(core, 'group');
    const warningSpy = jest.spyOn(core, 'warning');

    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      onlyIssueTypes: 'bug'
    };
    const TestIssueList: Issue[] = [
      generateIssue(
        opts,
        1,
        'A bug issue',
        '2020-01-01T17:00:00Z',
        '2020-01-01T17:00:00Z',
        false,
        false,
        [],
        false,
        false,
        undefined,
        [],
        'bug'
      ),
      generateIssue(
        opts,
        2,
        'A feature issue',
        '2020-01-01T17:00:00Z',
        '2020-01-01T17:00:00Z',
        false,
        false,
        [],
        false,
        false,
        undefined,
        [],
        'feature'
      ),
      generateIssue(
        opts,
        3,
        'A pull request',
        '2020-01-01T17:00:00Z',
        '2020-01-01T17:00:00Z',
        false,
        true,
        [],
        false,
        false,
        undefined,
        [],
        'feature'
      )
    ];
    const processor = new IssuesProcessorMock(
      opts,
      alwaysFalseStateMock,
      async p => (p === 1 ? TestIssueList : []),
      async () => [],
      async () => new Date().toDateString()
    );
    await processor.processIssues(1);

    // Only the bug issue is processed
    expect(processor.staleIssues.map(i => i.title)).toEqual(['A bug issue']);

    // PR is silently skipped — no logs should mention it across all logging methods
    const infoLogs = infoSpy.mock.calls.map(c => c[0]).join('\n');
    const warningLogs = warningSpy.mock.calls.map(c => c[0]).join('\n');
    const groupLogs = groupSpy.mock.calls.map(c => c[0]).join('\n');
    const allLogs = [infoLogs, warningLogs, groupLogs].join('\n');

    // Case-insensitive regex handles variations and ANSI codes
    expect(allLogs).not.toMatch(/pull request/i);
  });

  test('should process all issues and PRs if onlyIssueTypes is unset', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      onlyIssueTypes: ''
    };
    const TestIssueList: Issue[] = [
      generateIssue(
        opts,
        1,
        'A bug',
        '2020-01-01T17:00:00Z',
        '2020-01-01T17:00:00Z',
        false,
        false,
        [],
        false,
        false,
        undefined,
        [],
        'bug'
      ),
      generateIssue(
        opts,
        2,
        'A feature',
        '2020-01-01T17:00:00Z',
        '2020-01-01T17:00:00Z',
        false,
        false,
        [],
        false,
        false,
        undefined,
        [],
        'feature'
      ),
      generateIssue(
        opts,
        3,
        'A pull request',
        '2020-01-01T17:00:00Z',
        '2020-01-01T17:00:00Z',
        false,
        true,
        [],
        false,
        false,
        undefined,
        [],
        'feature'
      )
    ];
    const processor = new IssuesProcessorMock(
      opts,
      alwaysFalseStateMock,
      async p => (p === 1 ? TestIssueList : []),
      async () => [],
      async () => new Date().toDateString()
    );
    await processor.processIssues(1);
    expect(processor.staleIssues.map(i => i.title)).toEqual([
      'A bug',
      'A feature',
      'A pull request'
    ]);
  });
});
