import * as github from '@actions/github';
import {Issue} from '../src/classes/issue';
import {IComment} from '../src/interfaces/comment';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';
import {alwaysFalseStateMock} from './classes/state-mock';

test('processing an issue with no label will make it stale and close it, if it is old enough only if days-before-close is set to 0', async () => {
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 0
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(1);
});

test('processing an issue with no label and a start date as ECMAScript epoch in seconds being before the issue creation date will neither make it stale nor close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2000 = 946681200000;
  const opts: IIssuesProcessorOptions = {
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
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
});

test('processing an issue with no label and a start date as ECMAScript epoch in seconds being after the issue creation date will neither make it stale nor close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2021 = 1609455600000;
  const opts: IIssuesProcessorOptions = {
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
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
});

test('processing an issue with no label and a start date as ECMAScript epoch in milliseconds being before the issue creation date will neither make it stale nor close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2000 = 946681200000000;
  const opts: IIssuesProcessorOptions = {
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
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
});

test('processing an issue with no label and a start date as ECMAScript epoch in milliseconds being after the issue creation date will neither make it stale nor close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2021 = 1609455600000;
  const opts: IIssuesProcessorOptions = {
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
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
});

test('processing an issue with no label and a start date as ISO 8601 being before the issue creation date will make it stale and close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2000 = '2000-01-01T00:00:00Z';
  const opts: IIssuesProcessorOptions = {
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
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(1);
});

test('processing an issue with no label and a start date as ISO 8601 being after the issue creation date will neither make it stale nor close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2021 = '2021-01-01T00:00:00Z';
  const opts: IIssuesProcessorOptions = {
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
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
});

test('processing an issue with no label and a start date as RFC 2822 being before the issue creation date will make it stale and close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2000 = 'January 1, 2000 00:00:00';
  const opts: IIssuesProcessorOptions = {
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
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(1);
});

test('processing an issue with no label and a start date as RFC 2822 being after the issue creation date will neither make it stale nor close it when it is old enough and days-before-close is set to 0', async () => {
  expect.assertions(2);
  const january2021 = 'January 1, 2021 00:00:00';
  const opts: IIssuesProcessorOptions = {
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
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
});

test('processing an issue with no label will make it stale and close it, if it is old enough only if days-before-close is set to > 0 and days-before-issue-close is set to 0', async () => {
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 1,
    daysBeforeIssueClose: 0
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(1);
  expect(processor.deletedBranchIssues).toHaveLength(0);
});

test('processing an issue with no label will make it stale and not close it, if it is old enough only if days-before-close is set to > 0 and days-before-issue-close is set to > 0', async () => {
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 1,
    daysBeforeIssueClose: 1
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing an issue with no label will make it stale and not close it if days-before-close is set to > 0', async () => {
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: 15
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing an issue with no label will make it stale and not close it if days-before-close is set to -1 and days-before-issue-close is set to > 0', async () => {
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeClose: -1,
    daysBeforeIssueClose: 15
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing an issue with no label will not make it stale if days-before-stale is set to -1', async () => {
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    staleIssueMessage: '',
    daysBeforeStale: -1
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing an issue with no label will not make it stale if days-before-stale and days-before-issue-stale are set to -1', async () => {
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    staleIssueMessage: '',
    daysBeforeStale: -1,
    daysBeforeIssueStale: -1
  };
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', '2020-01-01T17:00:00Z')
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing an issue with no label will make it stale but not close it', async () => {
  // issue should be from 2 days ago so it will be
  // stale but not close-able, based on default settings
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - 2);
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'An issue with no label',
      issueDate.toDateString()
    )
  ];
  const processor = new IssuesProcessorMock(
    DefaultProcessorOptions,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing a stale issue will close it', async () => {
  const opts: IIssuesProcessorOptions = {
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
      false,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(1);
});

test('processing a stale issue containing a space in the label will close it', async () => {
  const opts: IIssuesProcessorOptions = {
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
      false,
      ['state: stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(1);
});

test('processing a stale issue containing a slash in the label will close it', async () => {
  const opts: IIssuesProcessorOptions = {
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
      false,
      ['lifecycle/stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(1);
});

test('processing a stale issue will close it when days-before-issue-stale override days-before-stale', async () => {
  const opts: IIssuesProcessorOptions = {
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
      false,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(1);
});

test('processing a stale PR will close it', async () => {
  const opts: IIssuesProcessorOptions = {
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
      false,
      true,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(1);
});

test('processing a stale PR will close it when days-before-pr-stale override days-before-stale', async () => {
  const opts: IIssuesProcessorOptions = {
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
      false,
      true,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(1);
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
      false,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(1);
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
      false,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(1);
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
      false,
      true,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(1);
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
      false,
      true,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(1);
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
      false,
      [],
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    DefaultProcessorOptions,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => []
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
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
      false,
      ['Stale'],
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    DefaultProcessorOptions,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
});

test('closed prs will not be marked stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'A closed PR that will not be marked',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      true,
      [],
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    DefaultProcessorOptions,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
});

test('stale closed prs will not be closed', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'A stale closed PR that will not be closed again',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      true,
      ['Stale'],
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    DefaultProcessorOptions,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
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
      false,
      [],
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    DefaultProcessorOptions,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : [])
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
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
      false,
      ['Stale'],
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    DefaultProcessorOptions,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
});

test('locked prs will not be marked stale', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'A locked PR that will not be marked stale',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      true,
      [],
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    DefaultProcessorOptions,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : [])
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
});

test('stale locked prs will not be closed', async () => {
  const TestIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
      1,
      'A stale locked PR that will not be closed',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      true,
      ['Stale'],
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    DefaultProcessorOptions,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
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
      false,
      ['Exempt']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
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
      false,
      ['Cool']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
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
      false,
      ['Cool']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.removedLabelIssues).toHaveLength(0);
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
      false,
      ['Cool']
    ),
    generateIssue(
      opts,
      2,
      'My first PR',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      true,
      ['Cool']
    ),
    generateIssue(
      opts,
      3,
      'Another issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      false
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(2); // PR should get processed even though it has an exempt **issue** label
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
      false,
      ['Stale']
    ),
    generateIssue(
      opts,
      2,
      'My first PR',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
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
      false,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.removedLabelIssues).toHaveLength(0);
});

test('stale label should be removed if a comment was added to a stale issue', async () => {
  const opts = {...DefaultProcessorOptions, removeStaleWhenUpdated: true};
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should un-stale',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      false,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [
      {
        user: {
          login: 'notme',
          type: 'User'
        },
        body: 'Body'
      }
    ], // return a fake comment to indicate there was an update
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.removedLabelIssues).toHaveLength(1);
});

test('when the option "labelsToAddWhenUnstale" is set, the labels should be added when unstale', async () => {
  expect.assertions(4);
  const opts = {
    ...DefaultProcessorOptions,
    removeStaleWhenUpdated: true,
    labelsToAddWhenUnstale: 'test'
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should have labels added to it when unstale',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      false,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [
      {
        user: {
          login: 'notme',
          type: 'User'
        },
        body: 'Body'
      }
    ], // return a fake comment to indicate there was an update
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.staleIssues).toHaveLength(0);
  // Stale should have been removed
  expect(processor.removedLabelIssues).toHaveLength(1);
  // Some label should have been added
  expect(processor.addedLabelIssues).toHaveLength(1);
});

test('when the option "labelsToRemoveWhenStale" is set, the labels should be removed when stale', async () => {
  expect.assertions(3);
  const opts = {
    ...DefaultProcessorOptions,
    removeStaleWhenUpdated: true,
    labelsToRemoveWhenStale: 'test'
  };
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should have labels removed to it when stale',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      false,
      ['Stale', 'test']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [
      {
        user: {
          login: 'notme',
          type: 'User'
        },
        body: 'Body'
      }
    ], // return a fake comment to indicate there was an update
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.staleIssues).toHaveLength(0);
  // test label should have been removed
  expect(processor.removedLabelIssues).toHaveLength(1);
});

test('stale label should not be removed if a comment was added by the bot (and the issue should be closed)', async () => {
  const opts = {...DefaultProcessorOptions, removeStaleWhenUpdated: true};
  github.context.actor = 'abot';
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should stay stale',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      false,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [
      {
        user: {
          login: 'abot',
          type: 'User'
        },
        body: 'This issue is stale'
      }
    ], // return a fake comment to indicate there was an update by the bot
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues).toHaveLength(1);
  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.removedLabelIssues).toHaveLength(0);
});

test('stale label containing a space should be removed if a comment was added to a stale issue', async () => {
  const opts: IIssuesProcessorOptions = {
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
      false,
      ['stat: stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [{user: {login: 'notme', type: 'User'}, body: 'Body'}], // return a fake comment to indicate there was an update
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.removedLabelIssues).toHaveLength(1);
});

test('stale issues should not be closed until after the closed number of days', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 1; // closes after 6 days
  const lastUpdate = new Date();
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
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.removedLabelIssues).toHaveLength(0);
  expect(processor.staleIssues).toHaveLength(1);
});

test('stale issues should be closed if the closed number of days (additive) is also passed', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 1; // closes after 6 days
  const lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 7);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should be stale and closed',
      lastUpdate.toString(),
      lastUpdate.toString(),
      false,
      false,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues).toHaveLength(1);
  expect(processor.removedLabelIssues).toHaveLength(0);
  expect(processor.staleIssues).toHaveLength(0);
});

test('stale issues should not be closed until after the closed number of days (long)', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  const lastUpdate = new Date();
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
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.removedLabelIssues).toHaveLength(0);
  expect(processor.staleIssues).toHaveLength(1);
});

test('skips stale message on issues when stale-issue-message is empty', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  opts.staleIssueMessage = '';
  const lastUpdate = new Date();
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
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // for sake of testing, mocking private function
  const markSpy = jest.spyOn(processor as any, '_markStale');

  await processor.processIssues(1);

  // issue should be staled
  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.removedLabelIssues).toHaveLength(0);
  expect(processor.staleIssues).toHaveLength(1);

  // comment should not be created
  expect(markSpy).toHaveBeenCalledWith(
    TestIssueList[0],
    opts.staleIssueMessage,
    opts.staleIssueLabel,
    // this option is skipMessage
    true
  );
});

test('send stale message on issues when stale-issue-message is not empty', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  opts.staleIssueMessage = 'dummy issue message';
  const lastUpdate = new Date();
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
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // for sake of testing, mocking private function
  const markSpy = jest.spyOn(processor as any, '_markStale');

  await processor.processIssues(1);

  // issue should be staled
  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.removedLabelIssues).toHaveLength(0);
  expect(processor.staleIssues).toHaveLength(1);

  // comment should not be created
  expect(markSpy).toHaveBeenCalledWith(
    TestIssueList[0],
    opts.staleIssueMessage,
    opts.staleIssueLabel,
    // this option is skipMessage
    false
  );
});

test('skips stale message on prs when stale-pr-message is empty', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  opts.stalePrMessage = '';
  const lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 10);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      lastUpdate.toString(),
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // for sake of testing, mocking private function
  const markSpy = jest.spyOn(processor as any, '_markStale');

  await processor.processIssues(1);

  // issue should be staled
  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.removedLabelIssues).toHaveLength(0);
  expect(processor.staleIssues).toHaveLength(1);

  // comment should not be created
  expect(markSpy).toHaveBeenCalledWith(
    TestIssueList[0],
    opts.stalePrMessage,
    opts.stalePrLabel,
    // this option is skipMessage
    true
  );
});

test('send stale message on prs when stale-pr-message is not empty', async () => {
  const opts = {...DefaultProcessorOptions};
  opts.daysBeforeStale = 5; // stale after 5 days
  opts.daysBeforeClose = 20; // closes after 25 days
  opts.stalePrMessage = 'dummy pr message';
  const lastUpdate = new Date();
  lastUpdate.setDate(lastUpdate.getDate() - 10);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue that should be marked stale but not closed',
      lastUpdate.toString(),
      lastUpdate.toString(),
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // for sake of testing, mocking private function
  const markSpy = jest.spyOn(processor as any, '_markStale');

  await processor.processIssues(1);

  // issue should be staled
  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.removedLabelIssues).toHaveLength(0);
  expect(processor.staleIssues).toHaveLength(1);

  // comment should not be created
  expect(markSpy).toHaveBeenCalledWith(
    TestIssueList[0],
    opts.stalePrMessage,
    opts.stalePrLabel,
    // this option is skipMessage
    false
  );
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
      false,
      isPullRequest,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  await processor.processIssues(1);

  expect(processor.closedIssues).toHaveLength(1);
  expect(processor.removedLabelIssues).toHaveLength(0);
  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.deletedBranchIssues).toHaveLength(1);
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
      false,
      isPullRequest,
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  await processor.processIssues(1);

  expect(processor.closedIssues).toHaveLength(1);
  expect(processor.removedLabelIssues).toHaveLength(0);
  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.deletedBranchIssues).toHaveLength(0);
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
      false,
      undefined,
      undefined,
      undefined,
      ''
    )
  ];
  const processor = new IssuesProcessorMock(
    DefaultProcessorOptions,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
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
      false,
      undefined,
      undefined,
      undefined,
      'Milestone'
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
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
      false,
      undefined,
      undefined,
      undefined,
      'Milestone1'
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
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
      false,
      undefined,
      undefined,
      undefined,
      'Milestone2'
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
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
      false,
      undefined,
      undefined,
      undefined,
      'Milestone2'
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
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
      false,
      undefined,
      undefined,
      undefined,
      'Milestone1'
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
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
      false,
      undefined,
      undefined,
      undefined,
      'Milestone1'
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
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
      false,
      undefined,
      undefined,
      undefined,
      'Milestone1'
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('processing an issue opened since 2 days and with the option "daysBeforeIssueStale" at 3 will not make it stale', async () => {
  expect.assertions(2);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 10,
    daysBeforeIssueStale: 3
  };
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - 2);
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', issueDate.toDateString())
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing an issue opened since 2 days and with the option "daysBeforeIssueStale" at 2 will make it stale', async () => {
  expect.assertions(2);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 10,
    daysBeforeIssueStale: 2
  };
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - 2);
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', issueDate.toDateString())
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing an issue opened since 2 days and with the option "daysBeforeIssueStale" at 1 will make it stale', async () => {
  expect.assertions(2);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 10,
    daysBeforeIssueStale: 1
  };
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - 2);
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', issueDate.toDateString())
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing an issue opened since 1 hour and with the option "daysBeforeIssueStale" at 0.1666666667 (4 hours) will not make it stale', async () => {
  expect.assertions(2);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 10,
    daysBeforeIssueStale: 0.1666666667
  };
  const issueDate = new Date();
  issueDate.setHours(issueDate.getHours() - 1);
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', issueDate.toISOString())
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toISOString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing an issue opened since 4 hours and with the option "daysBeforeIssueStale" at 0.1666666667 (4 hours) will make it stale', async () => {
  expect.assertions(2);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 10,
    daysBeforeIssueStale: 0.1666666667
  };
  const issueDate = new Date();
  issueDate.setHours(issueDate.getHours() - 4);
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', issueDate.toISOString())
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toISOString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing an issue opened since 5 hours and with the option "daysBeforeIssueStale" at 0.1666666667 (4 hours) will make it stale', async () => {
  expect.assertions(2);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 10,
    daysBeforeIssueStale: 0.1666666667
  };
  const issueDate = new Date();
  issueDate.setHours(issueDate.getHours() - 5);
  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', issueDate.toISOString())
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toISOString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing a pull request opened since 2 days and with the option "daysBeforePrStale" at 3 will not make it stale', async () => {
  expect.assertions(2);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 10,
    daysBeforePrStale: 3
  };
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - 2);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A pull request with no label',
      issueDate.toDateString(),
      issueDate.toDateString(),
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing a pull request opened since 2 days and with the option "daysBeforePrStale" at 2 will make it stale', async () => {
  expect.assertions(2);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 10,
    daysBeforePrStale: 2
  };
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - 2);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A pull request with no label',
      issueDate.toDateString(),
      issueDate.toDateString(),
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing a pull request opened since 2 days and with the option "daysBeforePrStale" at 1 will make it stale', async () => {
  expect.assertions(2);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 10,
    daysBeforePrStale: 1
  };
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - 2);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A pull request with no label',
      issueDate.toDateString(),
      issueDate.toDateString(),
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing a pull request opened since 1 hour and with the option "daysBeforePrStale" at 0.1666666667 (4 hours) will not make it stale', async () => {
  expect.assertions(2);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 10,
    daysBeforePrStale: 0.1666666667
  };
  const issueDate = new Date();
  issueDate.setHours(issueDate.getHours() - 1);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A pull request with no label',
      issueDate.toISOString(),
      issueDate.toISOString(),
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toISOString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing a pull request opened since 4 hours and with the option "daysBeforePrStale" at 0.1666666667 (4 hours) will make it stale', async () => {
  expect.assertions(2);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 10,
    daysBeforePrStale: 0.1666666667
  };
  const issueDate = new Date();
  issueDate.setHours(issueDate.getHours() - 4);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A pull request with no label',
      issueDate.toISOString(),
      issueDate.toISOString(),
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toISOString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing a pull request opened since 5 hours and with the option "daysBeforePrStale" at 0.1666666667 (4 hours) will make it stale', async () => {
  expect.assertions(2);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 10,
    daysBeforePrStale: 0.1666666667
  };
  const issueDate = new Date();
  issueDate.setHours(issueDate.getHours() - 5);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A pull request with no label',
      issueDate.toISOString(),
      issueDate.toISOString(),
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toISOString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing a previously closed issue with a close label will remove the close label', async () => {
  expect.assertions(1);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    closeIssueLabel: 'close',
    staleIssueLabel: 'stale'
  };
  const now: Date = new Date();
  const oneWeekAgo: Date = new Date(now.setDate(now.getDate() - 7));
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An opened issue with a close label',
      oneWeekAgo.toDateString(),
      now.toDateString(),
      false,
      false,
      ['close'],
      false,
      false
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.removedLabelIssues).toHaveLength(1);
});

test('processing a closed issue with a close label will not remove the close label', async () => {
  expect.assertions(1);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    closeIssueLabel: 'close',
    staleIssueLabel: 'stale'
  };
  const now: Date = new Date();
  const oneWeekAgo: Date = new Date(now.setDate(now.getDate() - 7));
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A closed issue with a close label',
      oneWeekAgo.toDateString(),
      now.toDateString(),
      false,
      false,
      ['close'],
      true,
      false
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.removedLabelIssues).toHaveLength(0);
});

test('processing a locked issue with a close label will not remove the close label', async () => {
  expect.assertions(1);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    closeIssueLabel: 'close',
    staleIssueLabel: 'stale'
  };
  const now: Date = new Date();
  const oneWeekAgo: Date = new Date(now.setDate(now.getDate() - 7));
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A closed issue with a close label',
      oneWeekAgo.toDateString(),
      now.toDateString(),
      false,
      false,
      ['close'],
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.removedLabelIssues).toHaveLength(0);
});

test('processing an issue stale since less than the daysBeforeStale with a stale label created after daysBeforeClose should close the issue', async () => {
  expect.assertions(3);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    staleIssueLabel: 'stale-label',
    daysBeforeStale: 30,
    daysBeforeClose: 7,
    closeIssueMessage: 'close message',
    removeStaleWhenUpdated: false
  };
  const now: Date = new Date();
  const updatedAt: Date = new Date(now.setDate(now.getDate() - 9));
  const labelCreatedAt: Date = new Date(now.setDate(now.getDate() - 17));
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A real issue example; see https://github.com/actions/stale/issues/351',
      updatedAt.toDateString(),
      new Date(2021, 0, 16).toDateString(),
      false,
      false,
      ['stale-label'], // This was the problem for the user BTW, the issue was re-opened without removing the previous stale label
      false,
      false
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async (): Promise<IComment[]> => Promise.resolve([]),
    async () => labelCreatedAt.toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.removedLabelIssues).toHaveLength(0);
  expect(processor.deletedBranchIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(1); // Expected at 0 by the user
});

test('processing an issue stale since less than the daysBeforeStale without a stale label should close the issue', async () => {
  expect.assertions(3);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    staleIssueLabel: 'stale-label',
    daysBeforeStale: 30,
    daysBeforeClose: 7,
    closeIssueMessage: 'close message',
    removeStaleWhenUpdated: false
  };
  const now: Date = new Date();
  const updatedAt: Date = new Date(now.setDate(now.getDate() - 9));
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A real issue example; see https://github.com/actions/stale/issues/351 but without the old stale label from the previous close',
      updatedAt.toDateString(),
      new Date(2021, 0, 16).toDateString(),
      false,
      false,
      [],
      false,
      false
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async (): Promise<IComment[]> => Promise.resolve([]),
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.removedLabelIssues).toHaveLength(0);
  expect(processor.deletedBranchIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing a pull request to be stale with the "stalePrMessage" option set will send a PR comment', async () => {
  expect.assertions(3);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    stalePrMessage: 'This PR is stale',
    daysBeforeStale: 10,
    daysBeforePrStale: 1
  };
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - 2);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A pull request with no label and a stale message',
      issueDate.toDateString(),
      issueDate.toDateString(),
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.statistics?.addedPullRequestsCommentsCount).toStrictEqual(1);
});

test('processing a pull request to be stale with the "stalePrMessage" option set to empty will not send a PR comment', async () => {
  expect.assertions(3);
  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    stalePrMessage: '',
    daysBeforeStale: 10,
    daysBeforePrStale: 1
  };
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - 2);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A pull request with no label and a stale message',
      issueDate.toDateString(),
      issueDate.toDateString(),
      false,
      true
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
  expect(processor.statistics?.addedPullRequestsCommentsCount).toStrictEqual(0);
});

test('processing an issue with the "includeOnlyAssigned" option and nonempty assignee list will stale the issue', async () => {
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - 2);

  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    staleIssueLabel: 'This issue is stale',
    includeOnlyAssigned: true
  };

  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'An issue with no label',
      issueDate.toDateString(),
      issueDate.toDateString(),
      false,
      false,
      [],
      false,
      false,
      undefined,
      ['assignee1']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('processing an issue with the "includeOnlyAssigned" option set and no assignees will not stale the issue', async () => {
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - 2);

  const opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    staleIssueLabel: 'This issue is stale',
    includeOnlyAssigned: true
  };

  const TestIssueList: Issue[] = [
    generateIssue(opts, 1, 'An issue with no label', issueDate.toDateString())
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0);
});
