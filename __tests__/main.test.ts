import * as core from '@actions/core';
import * as github from '@actions/github';
import {Octokit} from '@octokit/rest';

import {IssueProcessor, IssueProcessorOptions} from '../src/IssueProcessor';

type Issue = Octokit.IssuesListForRepoResponseItem;
type IssueLabel = Octokit.IssuesListForRepoResponseItemLabelsItem;
type IssueList = Octokit.Response<Octokit.IssuesListForRepoResponse>;

const FakeHeaders = {
  date: 'none',
  'x-ratelimit-limit': '',
  'x-ratelimit-remaining': '',
  'x-ratelimit-reset': '',
  'x-Octokit-request-id': '',
  'x-Octokit-media-type': '',
  link: '',
  'last-modified': '',
  etag: '',
  status: ''
};

const EmptyIssueList: IssueList = {
  data: [],
  status: 200,
  headers: FakeHeaders,

  *[Symbol.iterator]() {
    for (let i of this.data) {
      yield i;
    }
  }
};

test('empty issue list results in 1 operation', async () => {
  const options: IssueProcessorOptions = {
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
  const processor = new IssueProcessor(options);

  // process our fake issue list
  const operationsLeft = await processor.processIssues(
    1,
    () => new Promise<IssueList>(resolve => resolve(EmptyIssueList))
  );

  // processing an empty issue list should result in 1 operation
  expect(operationsLeft).toEqual(99);
});
