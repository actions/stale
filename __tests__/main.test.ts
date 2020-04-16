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
  isPullRequest: boolean = false
): Issue {
  return {
    number: id,
    labels: [],
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

test('processing an issue with no label will not make it stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(1, 'My first issue', Date.now().toString())
  ];

  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async () => TestIssueList
  );

  // process our fake issue list
  const operationsLeft = await processor.processIssues(1);

  // processing an empty issue list should result in 1 operation
  expect(operationsLeft).toBeLessThan(100);
});
