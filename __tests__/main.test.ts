import * as core from '@actions/core';
import * as github from '@actions/github';
import {Octokit} from '@octokit/rest';

import {
  IssueProcessor,
  Issue,
  Label,
  IssueProcessorOptions
} from '../src/IssueProcessor';

function generateIssue(
  id: number,
  title: string,
  updatedAt: string,
  isPullRequest: boolean = false,
  labels: string[] = []
): Issue {
  return {
    number: id,
    labels: labels.map(l => {
      return {name: l};
    }),
    title: title,
    updated_at: updatedAt,
    pull_request: isPullRequest ? {} : null
  };
}

const DefaultProcessorOptions: IssueProcessorOptions = {
  repoToken: 'none',
  staleIssueMessage: 'This issue is stale',
  stalePrMessage: 'This PR is stale',
  daysBeforeStale: 1,
  daysBeforeClose: 1,
  staleIssueLabel: 'Stale',
  exemptIssueLabels: '',
  stalePrLabel: 'Stale',
  exemptPrLabels: '',
  onlyLabels: '',
  operationsPerRun: 100,
  debugOnly: true
};

test('empty issue list results in 1 operation', async () => {
  const processor = new IssueProcessor(DefaultProcessorOptions, async () => []);

  // process our fake issue list
  const operationsLeft = await processor.processIssues(1);

  // processing an empty issue list should result in 1 operation
  expect(operationsLeft).toEqual(99);
});

test('processing an issue with no label will make it stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(1, 'My first issue', '2020-01-01T17:00:00Z')
  ];

  const processor = new IssueProcessor(DefaultProcessorOptions, async p =>
    p == 1 ? TestIssueList : []
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(1);
  expect(processor.closedIssues.length).toEqual(0);
});

test('processing a stale issue will close it', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(1, 'My first issue', '2020-01-01T17:00:00Z', false, ['Stale'])
  ];

  const processor = new IssueProcessor(DefaultProcessorOptions, async p =>
    p == 1 ? TestIssueList : []
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(1);
});

test('processing a stale PR will close it', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(1, 'My first PR', '2020-01-01T17:00:00Z', true, ['Stale'])
  ];

  const processor = new IssueProcessor(DefaultProcessorOptions, async p =>
    p == 1 ? TestIssueList : []
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(1);
});

test('exempt issue labels will not be marked stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(1, 'My first issue', '2020-01-01T17:00:00Z', false, [
      'Exempt'
    ])
  ];

  let opts = DefaultProcessorOptions;
  opts.exemptIssueLabels = 'Exempt';

  const processor = new IssueProcessor(DefaultProcessorOptions, async p =>
    p == 1 ? TestIssueList : []
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('exempt issue labels will not be marked stale (multi issue label with spaces)', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(1, 'My first issue', '2020-01-01T17:00:00Z', false, ['Cool'])
  ];

  let opts = DefaultProcessorOptions;
  opts.exemptIssueLabels = 'Exempt, Cool, None';

  const processor = new IssueProcessor(DefaultProcessorOptions, async p =>
    p == 1 ? TestIssueList : []
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('exempt issue labels will not be marked stale (multi issue label)', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(1, 'My first issue', '2020-01-01T17:00:00Z', false, ['Cool'])
  ];

  let opts = DefaultProcessorOptions;
  opts.exemptIssueLabels = 'Exempt,Cool,None';

  const processor = new IssueProcessor(DefaultProcessorOptions, async p =>
    p == 1 ? TestIssueList : []
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('exempt pr labels will not be marked stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(1, 'My first issue', '2020-01-01T17:00:00Z', false, ['Cool']),
    generateIssue(2, 'My first PR', '2020-01-01T17:00:00Z', true, ['Cool']),
    generateIssue(3, 'Another issue', '2020-01-01T17:00:00Z', false)
  ];

  let opts = DefaultProcessorOptions;
  opts.exemptIssueLabels = 'Cool';

  const processor = new IssueProcessor(DefaultProcessorOptions, async p =>
    p == 1 ? TestIssueList : []
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(2); // PR should get processed even though it has an exempt **issue** label
});
