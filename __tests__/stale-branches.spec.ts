import {IBranch} from '../src/interfaces/branch';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {alwaysFalseStateMock} from './classes/state-mock';

const daysAgo = (days: number): string =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const branch = (name: string, overrides: Partial<IBranch> = {}): IBranch => ({
  name,
  lastCommitDate: daysAgo(100),
  prClosedAt: null,
  hasOpenPr: false,
  isProtected: false,
  ...overrides
});

async function deletedBranches(
  options: Partial<IIssuesProcessorOptions>,
  branches: IBranch[]
): Promise<string[]> {
  const processor = new IssuesProcessorMock(
    {...DefaultProcessorOptions, ...options},
    alwaysFalseStateMock,
    async () => []
  );
  processor.getBranches = async () => branches;

  await processor.processIssues(1);

  return processor.deletedBranches;
}

describe('stale branches', () => {
  test('should not fetch or delete branches when disabled', async () => {
    const processor = new IssuesProcessorMock(
      DefaultProcessorOptions,
      alwaysFalseStateMock,
      async () => []
    );
    let fetched = false;
    processor.getBranches = async () => {
      fetched = true;
      return [];
    };

    await processor.processIssues(1);

    expect(fetched).toBe(false);
  });

  test('should not fetch branches when no operations remain', async () => {
    const processor = new IssuesProcessorMock(
      {...DefaultProcessorOptions, daysBeforeNoPrBranchDelete: 90},
      alwaysFalseStateMock,
      async () => []
    );
    let fetched = false;
    processor.getBranches = async () => {
      fetched = true;
      return [];
    };
    processor.operations.consumeOperations(
      DefaultProcessorOptions.operationsPerRun
    );

    await processor.processBranches();

    expect(fetched).toBe(false);
  });

  test('should use the matching threshold for branches with and without a PR', async () => {
    const result = await deletedBranches(
      {daysBeforePrBranchDelete: 14, daysBeforeNoPrBranchDelete: 90},
      [
        branch('pr-old', {prClosedAt: daysAgo(40)}),
        branch('pr-recent', {prClosedAt: daysAgo(10)}),
        branch('no-pr-old', {lastCommitDate: daysAgo(200)}),
        branch('no-pr-recent', {lastCommitDate: daysAgo(60)})
      ]
    );

    expect(result).toEqual(['pr-old', 'no-pr-old']);
  });

  test('should only process the enabled group', async () => {
    const result = await deletedBranches({daysBeforePrBranchDelete: 14}, [
      branch('pr', {prClosedAt: daysAgo(40)}),
      branch('no-pr')
    ]);

    expect(result).toEqual(['pr']);
  });

  test('should keep a PR branch with a commit after the PR was closed', async () => {
    const result = await deletedBranches({daysBeforePrBranchDelete: 14}, [
      branch('pushed-after-close', {
        prClosedAt: daysAgo(40),
        lastCommitDate: daysAgo(5)
      })
    ]);

    expect(result).toEqual([]);
  });

  test('should skip protected branches, branches with open PRs and exempt branches', async () => {
    const result = await deletedBranches(
      {daysBeforeNoPrBranchDelete: 90, exemptBranches: 'release/*, keep'},
      [
        branch('protected', {isProtected: true}),
        branch('open-pr', {hasOpenPr: true}),
        branch('release/1.0'),
        branch('release/1.0/hotfix'),
        branch('keep'),
        branch('stale')
      ]
    );

    expect(result).toEqual(['release/1.0/hotfix', 'stale']);
  });

  test('should stop deleting when no operations remain', async () => {
    const result = await deletedBranches(
      {daysBeforeNoPrBranchDelete: 90, operationsPerRun: 2},
      [branch('a'), branch('b'), branch('c')]
    );

    expect(result).toEqual(['a', 'b']);
  });
});
