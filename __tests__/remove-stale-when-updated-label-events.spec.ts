import {Issue} from '../src/classes/issue';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';
import {alwaysFalseStateMock} from './classes/state-mock';

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
