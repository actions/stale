import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {Issue} from '../src/classes/issue';
import {generateIssue} from './functions/generate-issue';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {alwaysFalseStateMock} from './classes/state-mock';
import {IIssueEvent} from '../src/interfaces/issue-event';

const opts: IIssuesProcessorOptions = {
  ...DefaultProcessorOptions,
  daysBeforeClose: 0
};
const testIssueList = async (page: number): Promise<Issue[]> => {
  return page == 1
    ? [
        generateIssue(opts, 1, 'Issue 1', '2020-01-01T17:00:00Z'),
        generateIssue(opts, 2, 'Issue 2', '2020-01-01T17:00:00Z')
      ]
    : [];
};

const pinnedEvent: IIssueEvent = {
  created_at: '2020-01-01T17:00:00Z',
  event: 'pinned',
  label: {}
};
const unpinnedEvent: IIssueEvent = {
  created_at: '2020-01-01T17:00:00Z',
  event: 'unpinned',
  label: {}
};
describe('exempt-pinned-issues options', (): void => {
  it('pinned issues should be skipped if exemptPinnedIssues true', async () => {
    const processor = new IssuesProcessorMock(
      {...opts, exemptPinnedIssues: true},
      alwaysFalseStateMock,
      testIssueList,
      async () => [],
      async () => new Date().toDateString(),
      async (issue: Issue) => undefined,
      async (issue: Issue) => (issue.number === 1 ? [pinnedEvent] : [])
    );
    await processor.processIssues(1);
    expect(processor.staleIssues).toHaveLength(1);
  });

  it('pinned issues should not be skipped if exemptPinnedIssues false', async () => {
    const processor = new IssuesProcessorMock(
      {...opts, exemptPinnedIssues: false},
      alwaysFalseStateMock,
      testIssueList,
      async () => [],
      async () => new Date().toDateString(),
      async (issue: Issue) => undefined,
      async (issue: Issue) => (issue.number === 1 ? [pinnedEvent] : [])
    );
    await processor.processIssues(1);
    expect(processor.staleIssues).toHaveLength(2);
  });

  it('pinned issues should not be skipped if exemptPinnedIssues true but it was unpinned', async () => {
    const processor = new IssuesProcessorMock(
      {...opts, exemptPinnedIssues: true},
      alwaysFalseStateMock,
      testIssueList,
      async () => [],
      async () => new Date().toDateString(),
      async (issue: Issue) => undefined,
      async (issue: Issue) =>
        issue.number === 1 ? [unpinnedEvent, pinnedEvent] : []
    );
    await processor.processIssues(1);
    expect(processor.staleIssues).toHaveLength(2);
  });
  it('pinned issues should not be skipped if exemptPinnedIssues true and it was unpinned and pinned', async () => {
    const processor = new IssuesProcessorMock(
      {...opts, exemptPinnedIssues: true},
      alwaysFalseStateMock,
      testIssueList,
      async () => [],
      async () => new Date().toDateString(),
      async (issue: Issue) => undefined,
      async (issue: Issue) =>
        issue.number === 1 ? [pinnedEvent, unpinnedEvent, pinnedEvent] : []
    );
    await processor.processIssues(1);
    expect(processor.staleIssues).toHaveLength(1);
  });
});
