import {Issue} from '../src/classes/issue';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';
import {alwaysFalseStateMock} from './classes/state-mock';

describe('only-issue-types option', () => {
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

  test('should process all issues if onlyIssueTypes is unset', async () => {
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
      'A feature'
    ]);
  });
});
