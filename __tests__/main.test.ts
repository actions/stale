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
  labels: string[] = [],
  isClosed: boolean = false,
  isLocked: boolean = false,
  createdAt: string = ""
): Issue {
  return {
    number: id,
    labels: labels.map(l => {
      return {name: l};
    }),
    title: title,
    updated_at: updatedAt,
    created_at: createdAt,
    pull_request: isPullRequest ? {} : null,
    state: isClosed ? 'closed' : 'open',
    locked: isLocked
  };
}

const DefaultProcessorOptions: IssueProcessorOptions = Object.freeze({
  repoToken: 'none',
  staleIssueMessage: 'This issue is stale',
  stalePrMessage: 'This PR is stale',
  closeIssueMessage: 'This issue is being closed',
  closePrMessage: 'This PR is being closed',
  daysBeforeStale: 1,
  daysBeforeClose: 30,
  dateField: "updated_at",
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
  skipStalePrMessage: false
});

test('empty issue list results in 1 operation', async () => {
  const processor = new IssueProcessor(
    DefaultProcessorOptions,
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
  const TestIssueList: Issue[] = [
    generateIssue(1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];

  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeClose = 0;

  const processor = new IssueProcessor(
    opts,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(1);
  expect(processor.closedIssues.length).toEqual(1);
});

test('processing an issue with no label will make it stale and not close it if days-before-close is set to > 0', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];

  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeClose = 15;

  const processor = new IssueProcessor(
    DefaultProcessorOptions,
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
  const TestIssueList: Issue[] = [
    generateIssue(1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];

  const opts = {
    ...DefaultProcessorOptions,
    staleIssueMessage: '',
    daysBeforeStale: -1
  };

  const processor = new IssueProcessor(
    opts,
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
    generateIssue(1, 'An issue with no label', issueDate.toDateString())
  ];

  const processor = new IssueProcessor(
    DefaultProcessorOptions,
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
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'A stale issue that should be closed',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale']
    )
  ];

  const processor = new IssueProcessor(
    DefaultProcessorOptions,
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
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'A stale PR that should be closed',
      '2020-01-01T17:00:00Z',
      true,
      ['Stale']
    )
  ];

  const processor = new IssueProcessor(
    DefaultProcessorOptions,
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
  const TestIssueList: Issue[] = [
    generateIssue(1, 'An issue with no label', '2020-01-01T17:00:00Z', false, [
      'Stale'
    ])
  ];

  const opts = {
    ...DefaultProcessorOptions,
    daysBeforeStale: -1,
    staleIssueMessage: ''
  };

  const processor = new IssueProcessor(
    opts,
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
  const TestIssueList: Issue[] = [
    generateIssue(1, 'An issue with no label', '2020-01-01T17:00:00Z', true, [
      'Stale'
    ])
  ];

  const opts = {
    ...DefaultProcessorOptions,
    daysBeforeStale: -1,
    stalePrMessage: ''
  };

  const processor = new IssueProcessor(
    opts,
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
      1,
      'A closed issue that will not be marked',
      '2020-01-01T17:00:00Z',
      false,
      [],
      true
    )
  ];

  const processor = new IssueProcessor(
    DefaultProcessorOptions,
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
      1,
      'A stale closed issue',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale'],
      true
    )
  ];

  const processor = new IssueProcessor(
    DefaultProcessorOptions,
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
      1,
      'A closed PR that will not be marked',
      '2020-01-01T17:00:00Z',
      true,
      [],
      true
    )
  ];

  const processor = new IssueProcessor(
    DefaultProcessorOptions,
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
      1,
      'A stale closed PR that will not be closed again',
      '2020-01-01T17:00:00Z',
      true,
      ['Stale'],
      true
    )
  ];

  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('locked issues will not be marked stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'A locked issue that will not be stale',
      '2020-01-01T17:00:00Z',
      false,
      [],
      false,
      true
    )
  ];

  const processor = new IssueProcessor(DefaultProcessorOptions, async p =>
    p == 1 ? TestIssueList : []
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('stale locked issues will not be closed', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'A stale locked issue that will not be closed',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale'],
      false,
      true
    )
  ];

  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('locked prs will not be marked stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'A locked PR that will not be marked stale',
      '2020-01-01T17:00:00Z',
      true,
      [],
      false,
      true
    )
  ];

  const processor = new IssueProcessor(DefaultProcessorOptions, async p =>
    p == 1 ? TestIssueList : []
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('stale locked prs will not be closed', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'A stale locked PR that will not be closed',
      '2020-01-01T17:00:00Z',
      true,
      ['Stale'],
      false,
      true
    )
  ];

  const processor = new IssueProcessor(
    DefaultProcessorOptions,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
});

test('exempt issue labels will not be marked stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(1, 'My first issue', '2020-01-01T17:00:00Z', false, [
      'Exempt'
    ])
  ];

  const opts = {...DefaultProcessorOptions};
  opts.exemptIssueLabels = 'Exempt';

  const processor = new IssueProcessor(
    opts,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
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

  const opts = {...DefaultProcessorOptions};
  opts.exemptIssueLabels = 'Exempt, Cool, None';

  const processor = new IssueProcessor(
    opts,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
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

  const opts = {...DefaultProcessorOptions};
  opts.exemptIssueLabels = 'Exempt,Cool,None';

  const processor = new IssueProcessor(
    opts,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
});

test('exempt pr labels will not be marked stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(1, 'My first issue', '2020-01-01T17:00:00Z', false, ['Cool']),
    generateIssue(2, 'My first PR', '2020-01-01T17:00:00Z', true, ['Cool']),
    generateIssue(3, 'Another issue', '2020-01-01T17:00:00Z', false)
  ];

  const opts = {...DefaultProcessorOptions};
  opts.exemptIssueLabels = 'Cool';

  const processor = new IssueProcessor(
    opts,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toEqual(2); // PR should get processed even though it has an exempt **issue** label
});

test('stale issues should not be closed if days is set to -1', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(1, 'My first issue', '2020-01-01T17:00:00Z', false, [
      'Stale'
    ]),
    generateIssue(2, 'My first PR', '2020-01-01T17:00:00Z', true, ['Stale']),
    generateIssue(3, 'Another issue', '2020-01-01T17:00:00Z', false, ['Stale'])
  ];

  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeClose = -1;

  const processor = new IssueProcessor(
    opts,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
});

test('stale label should be removed if a comment was added to a stale issue', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'An issue that should un-stale',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale']
    )
  ];

  const opts = {...DefaultProcessorOptions};
  opts.removeStaleWhenUpdated = true;

  const processor = new IssueProcessor(
    opts,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [{user: {login: 'notme', type: 'User'}}], // return a fake comment to indicate there was an update
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(1);
});

test('stale label should not be removed if a comment was added by the bot (and the issue should be closed)', async () => {
  github.context.actor = 'abot';
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'An issue that should stay stale',
      '2020-01-01T17:00:00Z',
      false,
      ['Stale']
    )
  ];

  const opts = {...DefaultProcessorOptions};
  opts.removeStaleWhenUpdated = true;

  const processor = new IssueProcessor(
    opts,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [{user: {login: 'abot', type: 'User'}}], // return a fake comment to indicate there was an update by the bot
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues.length).toEqual(1);
  expect(processor.staleIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
});

test('stale issues should not be closed until after the closed number of days', async () => {
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 5);
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      false
    )
  ];

  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 1; // closes after 6 days

  const processor = new IssueProcessor(
    opts,
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

test('issues should be marked stale if dateField is set to created_at', async () => {
  let lastUpdate = new Date();
  let creationDate = new Date();
  creationDate.setDate(creationDate.getDate() - 5);
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'An issue that should be marked stale',
      lastUpdate.toString(),
      false,
      [],
      false,
      false,
      creationDate.toString()      
    )
  ];

  const opts = {...DefaultProcessorOptions};
  opts.dateField = "created_at"; // stale 5 days since creation

  const processor = new IssueProcessor(
    opts,
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
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 7);
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'An issue that should be stale and closed',
      lastUpdate.toString(),
      false,
      ['Stale']
    )
  ];

  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 1; // closes after 6 days

  const processor = new IssueProcessor(
    opts,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues.length).toEqual(1);
  expect(processor.removedLabelIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(0);
});

test('stale issues should not be closed until after the closed number of days (long)', async () => {
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 10);
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      false
    )
  ];

  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days

  const processor = new IssueProcessor(
    opts,
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
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 10);
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      false
    )
  ];

  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  opts.skipStaleIssueMessage = true;

  const processor = new IssueProcessor(
    opts,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // for sake of testing, mocking private function
  const markSpy = jest.spyOn(processor as any, 'markStale');

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
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 10);
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      true
    )
  ];

  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  opts.skipStalePrMessage = true;

  const processor = new IssueProcessor(
    opts,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  // for sake of testing, mocking private function
  const markSpy = jest.spyOn(processor as any, 'markStale');

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
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 10);
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      false
    )
  ];

  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  opts.skipStalePrMessage = true;
  opts.staleIssueMessage = '';

  const processor = new IssueProcessor(
    opts,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  await processor.processIssues(1);

  // issue should be staled
  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(0);
});

test('not providing stalePrMessage takes precedence over skipStalePrMessage', async () => {
  let lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 10);
  const TestIssueList: Issue[] = [
    generateIssue(
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      true
    )
  ];

  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  opts.skipStalePrMessage = true;
  opts.stalePrMessage = '';

  const processor = new IssueProcessor(
    opts,
    async p => (p == 1 ? TestIssueList : []),
    async (num, dt) => [],
    async (issue, label) => new Date().toDateString()
  );

  await processor.processIssues(1);

  // issue should be staled
  expect(processor.closedIssues.length).toEqual(0);
  expect(processor.removedLabelIssues.length).toEqual(0);
  expect(processor.staleIssues.length).toEqual(0);
});
