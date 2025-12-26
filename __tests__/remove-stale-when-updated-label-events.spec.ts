import {Issue} from '../src/classes/issue';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';
import {alwaysFalseStateMock} from './classes/state-mock';
import {IState} from '../src/interfaces/state/state';
import {IIssueEvent} from '../src/interfaces/issue-event';
import {IssuesProcessor} from '../src/classes/issues-processor';

describe('remove-stale-when-updated with stale label events', (): void => {
  const markedStaleOn = '2025-01-01T00:00:00Z';
  const updatedAt = '2025-01-01T00:01:00Z';

  let options: IIssuesProcessorOptions;

  beforeEach((): void => {
    options = {
      ...DefaultProcessorOptions,
      removeStaleWhenUpdated: true
    };
  });

  const buildIssue = (): Issue =>
    generateIssue(
      options,
      1,
      'dummy-title',
      updatedAt,
      markedStaleOn,
      false,
      false,
      ['Stale']
    );

  test('does not remove stale label when only stale label events occurred', async (): Promise<void> => {
    expect.assertions(1);
    const issue = buildIssue();

    const processor = new IssuesProcessorMock(
      options,
      alwaysFalseStateMock,
      async p => (p === 1 ? [issue] : []),
      async () => [],
      async () => markedStaleOn,
      async () => true
    );

    await processor.processIssues();

    expect(processor.removedLabelIssues).toHaveLength(0);
  });

  test('removes stale label when updates are not just stale label events', async (): Promise<void> => {
    expect.assertions(1);
    const issue = buildIssue();

    const processor = new IssuesProcessorMock(
      options,
      alwaysFalseStateMock,
      async p => (p === 1 ? [issue] : []),
      async () => [],
      async () => markedStaleOn,
      async () => false
    );

    await processor.processIssues();

    expect(processor.removedLabelIssues).toHaveLength(1);
  });
});

class TestIssuesProcessor extends IssuesProcessor {
  constructor(
    options: IIssuesProcessorOptions,
    state: IState,
    events: IIssueEvent[]
  ) {
    super(options, state);
    const client = {
      rest: {
        issues: {
          listEvents: {
            endpoint: {
              merge: () => ({})
            }
          }
        }
      },
      paginate: {
        iterator: async function* () {
          yield {data: events};
        }
      }
    };
    (this as any).client = client;
  }

  async callhasOnlyStaleLabelAddedSince(
    issue: Issue,
    sinceDate: string,
    staleLabel: string
  ): Promise<boolean> {
    return this.hasOnlyStaleLabelAddedSince(issue, sinceDate, staleLabel);
  }
}

describe('hasOnlyStaleLabelAddedSince', (): void => {
  const staleLabel = 'Stale';
  const sinceDate = '2025-01-01T00:00:00Z';
  const originalRepo = process.env.GITHUB_REPOSITORY;

  let options: IIssuesProcessorOptions;

  beforeEach((): void => {
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    options = {
      ...DefaultProcessorOptions,
      staleIssueLabel: staleLabel,
      removeStaleWhenUpdated: true
    };
  });

  afterEach((): void => {
    if (originalRepo === undefined) {
      delete process.env.GITHUB_REPOSITORY;
    } else {
      process.env.GITHUB_REPOSITORY = originalRepo;
    }
  });

  const buildIssue = (): Issue =>
    generateIssue(
      options,
      1,
      'dummy-title',
      '2025-01-01T00:02:00Z',
      sinceDate,
      false,
      false,
      [staleLabel]
    );

  test('returns true when only stale label events exist after the since date', async (): Promise<void> => {
    expect.assertions(1);
    const issue = buildIssue();
    const events: IIssueEvent[] = [
      // Event before the sinceDate should be ignored.
      {
        event: 'labeled',
        created_at: '2024-12-31T23:59:00Z',
        label: {name: staleLabel}
      },
      {
        event: 'labeled',
        created_at: '2025-01-01T00:00:10Z',
        label: {name: staleLabel}
      }
    ];
    const processor = new TestIssuesProcessor(
      options,
      alwaysFalseStateMock,
      events
    );

    const result = await processor.callhasOnlyStaleLabelAddedSince(
      issue,
      sinceDate,
      staleLabel
    );

    expect(result).toBe(true);
  });

  test('returns false when a non-stale label event exists after the since date', async (): Promise<void> => {
    expect.assertions(1);
    const issue = buildIssue();
    const events: IIssueEvent[] = [
      {
        event: 'labeled',
        created_at: '2025-01-01T00:00:10Z',
        label: {name: 'other-label'}
      }
    ];
    const processor = new TestIssuesProcessor(
      options,
      alwaysFalseStateMock,
      events
    );

    const result = await processor.callhasOnlyStaleLabelAddedSince(
      issue,
      sinceDate,
      staleLabel
    );

    expect(result).toBe(false);
  });

  test('returns false when stale label is removed after the since date', async (): Promise<void> => {
    expect.assertions(1);
    const issue = buildIssue();
    const events: IIssueEvent[] = [
      {
        event: 'unlabeled',
        created_at: '2025-01-01T00:00:10Z',
        label: {name: staleLabel}
      }
    ];
    const processor = new TestIssuesProcessor(
      options,
      alwaysFalseStateMock,
      events
    );

    const result = await processor.callhasOnlyStaleLabelAddedSince(
      issue,
      sinceDate,
      staleLabel
    );

    expect(result).toBe(false);
  });

  test('returns false when a non-label event exists after the since date', async (): Promise<void> => {
    expect.assertions(1);
    const issue = buildIssue();
    const events: IIssueEvent[] = [
      {
        event: 'commented',
        created_at: '2025-01-01T00:00:10Z',
        label: {name: staleLabel}
      }
    ];
    const processor = new TestIssuesProcessor(
      options,
      alwaysFalseStateMock,
      events
    );

    const result = await processor.callhasOnlyStaleLabelAddedSince(
      issue,
      sinceDate,
      staleLabel
    );

    expect(result).toBe(false);
  });

  test('includes events that occur exactly at the since date boundary', async (): Promise<void> => {
    expect.assertions(1);
    const issue = buildIssue();
    const events: IIssueEvent[] = [
      {
        event: 'labeled',
        created_at: sinceDate,
        label: {name: staleLabel}
      }
    ];
    const processor = new TestIssuesProcessor(
      options,
      alwaysFalseStateMock,
      events
    );

    const result = await processor.callhasOnlyStaleLabelAddedSince(
      issue,
      sinceDate,
      staleLabel
    );

    expect(result).toBe(true);
  });
});
