import {IssuesProcessor} from '../src/classes/issues-processor';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {alwaysFalseStateMock} from './classes/state-mock';

jest.mock('@actions/github', () => ({
  context: {
    repo: {owner: 'test-owner', repo: 'test-repo'}
  },
  getOctokit: jest.fn(() => ({
    rest: {
      issues: {
        listForRepo: jest.fn().mockResolvedValue({data: []}),
        listComments: jest.fn().mockResolvedValue({data: []}),
        listEvents: {
          endpoint: {merge: jest.fn().mockReturnValue({})}
        },
        addLabels: jest.fn().mockResolvedValue({}),
        removeLabel: jest.fn().mockResolvedValue({}),
        createComment: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({})
      },
      pulls: {
        list: jest.fn().mockResolvedValue({data: []}),
        get: jest.fn().mockResolvedValue({data: {}})
      }
    },
    paginate: jest.fn().mockResolvedValue([])
  }))
}));

function buildProcessor(opts: IIssuesProcessorOptions): {
  processor: IssuesProcessor;
  mockListForRepo: jest.Mock;
  mockPullsList: jest.Mock;
} {
  const processor = new IssuesProcessor(opts, alwaysFalseStateMock);

  const mockListForRepo = jest.fn().mockResolvedValue({data: []});
  const mockPullsList = jest.fn().mockResolvedValue({data: []});

  (processor as any).client = {
    rest: {
      issues: {listForRepo: mockListForRepo},
      pulls: {list: mockPullsList}
    }
  };

  return {processor, mockListForRepo, mockPullsList};
}

describe('getIssues API selection based on issue days configuration', () => {
  test('uses issues.listForRepo when issue processing is enabled', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      daysBeforeIssueStale: 14,
      daysBeforeIssueClose: 7
    };
    const {processor, mockListForRepo, mockPullsList} = buildProcessor(opts);

    await processor.getIssues(1);

    expect(mockListForRepo).toHaveBeenCalledTimes(1);
    expect(mockPullsList).not.toHaveBeenCalled();
  });

  test('uses pulls.list when days-before-issue-stale and days-before-issue-close are both -1', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      daysBeforeIssueStale: -1,
      daysBeforeIssueClose: -1
    };
    const {processor, mockListForRepo, mockPullsList} = buildProcessor(opts);

    await processor.getIssues(1);

    expect(mockPullsList).toHaveBeenCalledTimes(1);
    expect(mockListForRepo).not.toHaveBeenCalled();
  });

  test('uses issues.listForRepo when only days-before-issue-stale is -1 but close is not', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      daysBeforeIssueStale: -1,
      daysBeforeIssueClose: 7
    };
    const {processor, mockListForRepo, mockPullsList} = buildProcessor(opts);

    await processor.getIssues(1);

    expect(mockListForRepo).toHaveBeenCalledTimes(1);
    expect(mockPullsList).not.toHaveBeenCalled();
  });

  test('uses issues.listForRepo when only days-before-issue-close is -1 but stale is not', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      daysBeforeIssueStale: 14,
      daysBeforeIssueClose: -1
    };
    const {processor, mockListForRepo, mockPullsList} = buildProcessor(opts);

    await processor.getIssues(1);

    expect(mockListForRepo).toHaveBeenCalledTimes(1);
    expect(mockPullsList).not.toHaveBeenCalled();
  });

  test('uses issues.listForRepo when days are NaN (falls back to daysBeforeStale)', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      daysBeforeStale: 14,
      daysBeforeClose: 7,
      daysBeforeIssueStale: NaN,
      daysBeforeIssueClose: NaN
    };
    const {processor, mockListForRepo, mockPullsList} = buildProcessor(opts);

    await processor.getIssues(1);

    expect(mockListForRepo).toHaveBeenCalledTimes(1);
    expect(mockPullsList).not.toHaveBeenCalled();
  });

  test('items returned via pulls.list are treated as pull requests', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      daysBeforeIssueStale: -1,
      daysBeforeIssueClose: -1
    };
    const processor = new IssuesProcessor(opts, alwaysFalseStateMock);

    const fakePr = {
      number: 42,
      title: 'A pull request',
      state: 'open',
      locked: false,
      draft: false,
      labels: [],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      milestone: null,
      assignees: []
    };

    (processor as any).client = {
      rest: {
        issues: {listForRepo: jest.fn()},
        pulls: {list: jest.fn().mockResolvedValue({data: [fakePr]})}
      }
    };

    const issues = await processor.getIssues(1);

    expect(issues).toHaveLength(1);
    expect(issues[0].isPullRequest).toBe(true);
    expect(issues[0].number).toBe(42);
  });

  test('uses created sort for pulls.list when sortBy is comments (unsupported by pulls API)', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      daysBeforeIssueStale: -1,
      daysBeforeIssueClose: -1,
      sortBy: 'comments'
    };
    const {processor, mockPullsList} = buildProcessor(opts);

    await processor.getIssues(1);

    expect(mockPullsList).toHaveBeenCalledWith(
      expect.objectContaining({sort: 'created'})
    );
  });

  test('passes updated sort through to pulls.list when sortBy is updated', async () => {
    const opts: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      daysBeforeIssueStale: -1,
      daysBeforeIssueClose: -1,
      sortBy: 'updated'
    };
    const {processor, mockPullsList} = buildProcessor(opts);

    await processor.getIssues(1);

    expect(mockPullsList).toHaveBeenCalledWith(
      expect.objectContaining({sort: 'updated'})
    );
  });
});
