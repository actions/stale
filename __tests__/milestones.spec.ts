import {Issue} from '../src/classes/issue';
import {IssuesProcessor} from '../src/classes/issues-processor';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';

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
  const processor = new IssuesProcessor(
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
  const processor = new IssuesProcessor(
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
  const processor = new IssuesProcessor(
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
  const processor = new IssuesProcessor(
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
  const processor = new IssuesProcessor(
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
  const processor = new IssuesProcessor(
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
  const processor = new IssuesProcessor(
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
  const processor = new IssuesProcessor(
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
