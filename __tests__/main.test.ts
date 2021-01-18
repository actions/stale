import * as github from '@actions/github';
import {Issue} from '../src/classes/issue';

import {IssueProcessor, IssueProcessorOptions} from '../src/IssueProcessor';
import {IsoDateString} from '../src/types/iso-date-string';

function generateIssue(
  options: IssueProcessorOptions,
  id: number,
  title: string,
  updatedAt: IsoDateString,
  createdAt: IsoDateString = updatedAt,
  isPullRequest: boolean = false,
  labels: string[] = [],
  isClosed: boolean = false,
  isLocked: boolean = false,
  milestone = ''
): Issue {
  return new Issue(options, {
    number: id,
    labels: labels.map(l => {
      return {name: l};
    }),
    title: title,
    created_at: createdAt,
    updated_at: updatedAt,
    pull_request: isPullRequest ? {} : null,
    state: isClosed ? 'closed' : 'open',
    locked: isLocked,
    milestone: {
      title: milestone
    }
  });
}

const DefaultProcessorOptions: IssueProcessorOptions = Object.freeze({
  repoToken: 'none',
  staleIssueMessage: 'This issue is stale',
  stalePrMessage: 'This PR is stale',
  closeIssueMessage: 'This issue is being closed',
  closePrMessage: 'This PR is being closed',
  daysBeforeStale: 1,
  daysBeforeIssueStale: NaN,
  daysBeforePrStale: NaN,
  daysBeforeClose: 30,
  daysBeforeIssueClose: NaN,
  daysBeforePrClose: NaN,
  staleIssueLabel: 'Stale',
  closeIssueLabel: '',
  exemptIssueLabels: '',
  stalePrLabel: 'Stale',
  closePrLabel: '',
  exemptPrLabels: '',
  onlyLabels: '',
  operationsPerRun: 100,
  debugOnly: true,
  removeStaleWhenUpdated: false,
  ascending: false,
  skipStaleIssueMessage: false,
  skipStalePrMessage: false,
  deleteBranch: false,
  startDate: '',
  exemptMilestones: '',
  exemptIssueMilestones: '',
  exemptPrMilestones: ''
});

test('empty issue list results in 1 operation', async () => {
  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async () => 'abot',
    async () => [],
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  const operationsLeft = await processor.processIssues(1);

  // processing an empty issue list should result in 1 operation
  expect(operationsLeft).toEqual(99);
});

test('processing an issue with no label will make it stale and close it, if it is old enough only if days-before-close is set to 0', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 0
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(1);
  expect(processor.closedIssues.length).toEqual(1);
});

test('processing an issue with no label and a start date as ECMAScript epoch in seconds being before the issue creation date will not make it stale nor close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2000 = 946681200000;
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 0,
    startDate: january2000.toString()
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
});

test('processing an issue with no label and a start date as ECMAScript epoch in seconds being after the issue creation date will not make it stale nor close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2021 = 1609455600000;
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 0,
    startDate: january2021.toString()
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
});

test('processing an issue with no label and a start date as ECMAScript epoch in milliseconds being before the issue creation date will not make it stale nor close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2000 = 946681200000000;
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 0,
    startDate: january2000.toString()
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
});

test('processing an issue with no label and a start date as ECMAScript epoch in milliseconds being after the issue creation date will not make it stale nor close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2021 = 1609455600000;
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 0,
    startDate: january2021.toString()
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
});

test('processing an issue with no label and a start date as ISO 8601 being before the issue creation date will make it stale and close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2000 = '2000-01-01T00:00:00Z';
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 0,
    startDate: january2000.toString()
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(1);
});

test('processing an issue with no label and a start date as ISO 8601 being after the issue creation date will not make it stale nor close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2021 = '2021-01-01T00:00:00Z';
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 0,
    startDate: january2021.toString()
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
});

test('processing an issue with no label and a start date as RFC 2822 being before the issue creation date will make it stale and close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2000 = 'January 1, 2000 00:00:00';
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 0,
    startDate: january2000.toString()
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(1);
});

test('processing an issue with no label and a start date as RFC 2822 being after the issue creation date will not make it stale nor close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2021 = 'January 1, 2021 00:00:00';
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 0,
    startDate: january2021.toString()
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
});

test('processing an issue with no label will make it stale and close it, if it is old enough only if days-before-close is set to > 0 and days-before-issue-close is set to 0', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 1,
    daysBeforeIssueClose: 0
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(1);
  expect(processor.closedIssues.length).toEqual(1);
  expect(processor.deletedBranchIssues.length).toEqual(0);
});

test('processing an issue with no label will make it stale and not close it, if it is old enough only if days-before-close is set to > 0 and days-before-issue-close is set to > 0', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 1,
    daysBeforeIssueClose: 1
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(1);
  expect(processor.closedIssues.length).toEqual(0);
});

test('processing an issue with no label will make it stale and not close it if days-before-close is set to > 0', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 15
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(1);
  expect(processor.closedIssues.length).toEqual(0);
});

test('processing an issue with no label will make it stale and not close it if days-before-close is set to -1 and days-before-issue-close is set to > 0', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: -1,
    daysBeforeIssueClose: 15
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(1);
  expect(processor.closedIssues.length).toEqual(0);
});

test('processing an issue with no label will not make it stale if days-before-stale is set to -1', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    staleIssueMessage: '',
    daysBeforeStale: -1
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('processing an issue with no label will not make it stale if days-before-stale and days-before-issue-stale are set to -1', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    staleIssueMessage: '',
    daysBeforeStale: -1,
    daysBeforeIssueStale: -1
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('processing an issue with no label will make it stale but not close it', async () => {
  // issue should be from 2 days ago so it will be
  // stale but not close-able, based on default settings
  let issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - 2);
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'An issue with no label',
      issueDate.toDateString()
    )
  ];
  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(1);
  expect(processor.closedIssues.length).toEqual(0);
});

test('processing a stale issue will close it', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 30
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A stale issue that should be closed',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(1);
});

test('processing a stale issue containing a space in the label will close it', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    staleIssueLabel: 'state: stale'
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A stale issue that should be closed',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['state: stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(1);
});

test('processing a stale issue containing a slash in the label will close it', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    staleIssueLabel: 'lifecycle/stale'
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A stale issue that should be closed',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['lifecycle/stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(1);
});

test('processing a stale issue will close it when days-before-issue-stale override days-before-stale', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 30,
    daysBeforeIssueStale: 30
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A stale issue that should be closed',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(1);
});

test('processing a stale PR will close it', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 30
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A stale PR that should be closed',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(1);
});

test('processing a stale PR will close it when days-before-pr-stale override days-before-stale', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 30,
    daysBeforePrClose: 30
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A stale PR that should be closed',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(1);
});

test('processing a stale issue will close it even if configured not to mark as stale', async () => {
  const opts = {
    ...DefaultProcessorOptions,
    daysBeforeStale: -1,
    staleIssueMessage: ''
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(1);
});

test('processing a stale issue will close it even if configured not to mark as stale when days-before-issue-stale override days-before-stale', async () => {
  const opts = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 0,
    daysBeforeIssueStale: -1,
    staleIssueMessage: ''
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(1);
});

test('processing a stale PR will close it even if configured not to mark as stale', async () => {
  const opts = {
    ...DefaultProcessorOptions,
    daysBeforeStale: -1,
    stalePrMessage: ''
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(1);
});

test('processing a stale PR will close it even if configured not to mark as stale when days-before-pr-stale override days-before-stale', async () => {
  const opts = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 0,
    daysBeforePrStale: -1,
    stalePrMessage: ''
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue with no label',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(1);
});

test('closed issues will not be marked stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'A closed issue that will not be marked',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      [],
      true
    )
  ];
  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => []
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('stale closed issues will not be closed', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'A stale closed issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale'],
      true
    )
  ];
  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('closed prs will not be marked stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'A closed PR that will not be marked',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      [],
      true
    )
  ];
  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('stale closed prs will not be closed', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'A stale closed PR that will not be closed again',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      ['Stale'],
      true
    )
  ];
  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('locked issues will not be marked stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'A locked issue that will not be stale',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      [],
      false,
      true
    )
  ];
  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : [])
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('stale locked issues will not be closed', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'A stale locked issue that will not be closed',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale'],
      false,
      true
    )
  ];
  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('locked prs will not be marked stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'A locked PR that will not be marked stale',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      [],
      false,
      true
    )
  ];
  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : [])
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('stale locked prs will not be closed', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'A stale locked PR that will not be closed',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      ['Stale'],
      false,
      true
    )
  ];
  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('exempt issue labels will not be marked stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptIssueLabels = 'Exempt';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Exempt']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('exempt issue labels will not be marked stale (multi issue label with spaces)', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.exemptIssueLabels = 'Exempt, Cool, None';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Cool']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('exempt issue labels will not be marked stale (multi issue label)', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.exemptIssueLabels = 'Exempt,Cool,None';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Cool']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
});

test('exempt pr labels will not be marked stale', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.exemptIssueLabels = 'Cool';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Cool']
    ),
    generateIssue(
      opts,
      2,
      'My first PR',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      ['Cool']
    ),
    generateIssue(
      opts,
      3,
      'Another issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(2); // PR should get processed even though it has an exempt **issue** label
});

test('exempt issue labels will not be marked stale and will remove the existing stale label', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptIssueLabels = 'Exempt';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Exempt', 'Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [
      {
        user: {
          login: 'notme',
          type: 'User'
        }
      }
    ], // return a fake comment to indicate there was an update
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(1);
});

test('stale issues should not be closed if days is set to -1', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeClose = -1;
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale']
    ),
    generateIssue(
      opts,
      2,
      'My first PR',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      ['Stale']
    ),
    generateIssue(
      opts,
      3,
      'Another issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
});

test('stale label should be removed if a comment was added to a stale issue', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.removeStaleWhenUpdated = true;
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should un-stale',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [
      {
        user: {
          login: 'notme',
          type: 'User'
        }
      }
    ], // return a fake comment to indicate there was an update
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(1);
});

test('stale label should not be removed if a comment was added by the bot (and the issue should be closed)', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.removeStaleWhenUpdated = true;
  github.context.actor = 'abot';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should stay stale',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [
      {
        user: {
          login: 'abot',
          type: 'User'
        }
      }
    ], // return a fake comment to indicate there was an update by the bot
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues.length).toEqual(1);
  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
});

test('stale label containing a space should be removed if a comment was added to a stale issue', async () => {
  const opts: IssueProcessorOptions = {
    ...DefaultProcessorOptions,
    removeStaleWhenUpdated: true,
    staleIssueLabel: 'stat: stale'
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should un-stale',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      ['stat: stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [{user: {login: 'notme', type: 'User'}}], // return a fake comment to indicate there was an update
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(1);
});

test('stale issues should not be closed until after the closed number of days', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 1; // closes after 6 days
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 5);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      lastUpdate.toString(),
      false
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(1);
});

test('stale issues should be closed if the closed nubmer of days (additive) is also passed', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 1; // closes after 6 days
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 7);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should be stale and closed',
      lastUpdate.toString(),
      lastUpdate.toString(),
      false,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues.length).toEqual(1);
  expect(processor.removedLabelIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(0);
});

test('stale issues should not be closed until after the closed number of days (long)', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 10);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      lastUpdate.toString(),
      false
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(1);
});

test('skips stale message on issues when skip-stale-issue-message is set', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  opts.skipStaleIssueMessage = true;
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 10);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      lastUpdate.toString(),
      false
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // for sake of testing, mocking private function
  const markSpy = jest.spyOn(processor as any, '_markStale');

  await processor.processIssues(1);

  // issue should be staled
  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(1);

  // comment should not be created
  expect(markSpy).toHaveBeenCalledWith(
    TestIssueList[0],
    opts.staleIssueMessage,
    opts.staleIssueLabel,
    // this option is skipMessage
    true
  );
});

test('skips stale message on prs when skip-stale-pr-message is set', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  opts.skipStalePrMessage = true;
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 10);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      lastUpdate.toString(),
      true
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // for sake of testing, mocking private function
  const markSpy = jest.spyOn(processor as any, '_markStale');

  await processor.processIssues(1);

  // issue should be staled
  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(1);

  // comment should not be created
  expect(markSpy).toHaveBeenCalledWith(
    TestIssueList[0],
    opts.stalePrMessage,
    opts.stalePrLabel,
    // this option is skipMessage
    true
  );
});

test('not providing state takes precedence over skipStaleIssueMessage', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  opts.skipStalePrMessage = true;
  opts.staleIssueMessage = '';
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 10);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      lastUpdate.toString(),
      false
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  await processor.processIssues(1);

  // issue should be staled
  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(0);
});

test('not providing stalePrMessage takes precedence over skipStalePrMessage', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  opts.skipStalePrMessage = true;
  opts.stalePrMessage = '';
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 10);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      lastUpdate.toString(),
      true
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  await processor.processIssues(1);

  // issue should be staled
  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(0);
});

test('git branch is deleted when option is enabled', async () => {
  const opts = {...DefaultProcessorOptions, deleteBranch: true};
  const isPullRequest = true;
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should have its branch deleted',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      isPullRequest,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  await processor.processIssues(1);

  expect(processor.closedIssues.length).toEqual(1);
  expect(processor.removedLabelIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.deletedBranchIssues.length).toEqual(1);
});

test('git branch is not deleted when issue is not pull request', async () => {
  const opts = {...DefaultProcessorOptions, deleteBranch: true};
  const isPullRequest = false;
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should not have its branch deleted',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      isPullRequest,
      ['Stale']
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  await processor.processIssues(1);

  expect(processor.closedIssues.length).toEqual(1);
  expect(processor.removedLabelIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.deletedBranchIssues.length).toEqual(0);
});

test('an issue without a milestone will be marked as stale', async () => {
  expect.assertions(3);
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      undefined,
      undefined,
      undefined,
      ''
    )
  ];
  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('an issue without an exempted milestone will be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      undefined,
      undefined,
      undefined,
      'Milestone'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('an issue with an exempted milestone will not be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      undefined,
      undefined,
      undefined,
      'Milestone1'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('an issue with an exempted milestone will not be marked as stale (multi milestones with spaces)', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1, Milestone2';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      undefined,
      undefined,
      undefined,
      'Milestone2'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('an issue with an exempted milestone will not be marked as stale (multi milestones without spaces)', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1,Milestone2';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      undefined,
      undefined,
      undefined,
      'Milestone2'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('an issue with an exempted milestone but without an exempted issue milestone will not be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  opts.exemptIssueMilestones = '';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      undefined,
      undefined,
      undefined,
      'Milestone1'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('an issue with an exempted milestone but with another exempted issue milestone will be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  opts.exemptIssueMilestones = 'Milestone2';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      undefined,
      undefined,
      undefined,
      'Milestone1'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('an issue with an exempted milestone and with an exempted issue milestone will not be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  opts.exemptIssueMilestones = 'Milestone1';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      undefined,
      undefined,
      undefined,
      'Milestone1'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR without a milestone will be marked as stale', async () => {
  expect.assertions(3);
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      undefined,
      undefined,
      undefined,
      ''
    )
  ];
  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR without an exempted milestone will be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      undefined,
      undefined,
      undefined,
      'Milestone'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR with an exempted milestone will not be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      undefined,
      undefined,
      undefined,
      'Milestone1'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR with an exempted milestone will not be marked as stale (multi milestones with spaces)', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1, Milestone2';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      undefined,
      undefined,
      undefined,
      'Milestone2'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR with an exempted milestone will not be marked as stale (multi milestones without spaces)', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1,Milestone2';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      undefined,
      undefined,
      undefined,
      'Milestone2'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR with an exempted milestone but without an exempted issue milestone will not be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  opts.exemptPrMilestones = '';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      undefined,
      undefined,
      undefined,
      'Milestone1'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR with an exempted milestone but with another exempted issue milestone will be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  opts.exemptPrMilestones = 'Milestone2';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      undefined,
      undefined,
      undefined,
      'Milestone1'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR with an exempted milestone and with an exempted issue milestone will not be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  opts.exemptPrMilestones = 'Milestone1';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'My first issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      true,
      undefined,
      undefined,
      undefined,
      'Milestone1'
    )
  ];
  const processor = new IssueProcessor(
    opts,
    async () => 'abot',
    async p => (p == 1 ? TestIssueList : []),
    async (num: number, dt: string) => [],
    async (issue: Issue, label: string) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});
