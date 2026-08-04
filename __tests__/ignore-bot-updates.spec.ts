import {expect, test} from '@jest/globals';
import {Issue} from '../src/classes/issue.js';
import {IIssueEvent} from '../src/interfaces/issue-event.js';
import {IssuesProcessorMock} from './classes/issues-processor-mock.js';
import {DefaultProcessorOptions} from './constants/default-processor-options.js';
import {generateIssue} from './functions/generate-issue.js';
import {alwaysFalseStateMock} from './classes/state-mock.js';

const millisPerDay = 1000 * 60 * 60 * 24;

function daysAgo(days: number): string {
  return new Date(Date.now() - days * millisPerDay).toISOString();
}

const botLabeledEvent = (createdAt: string, label: string): IIssueEvent => ({
  created_at: createdAt,
  event: 'labeled',
  label: {name: label},
  actor: {login: 'some-app[bot]', type: 'Bot'}
});

const botCommentedEvent = (createdAt: string): IIssueEvent => ({
  created_at: createdAt,
  event: 'commented',
  label: {name: ''},
  actor: {login: 'some-app[bot]', type: 'Bot'}
});

const humanLabeledEvent = (createdAt: string, label: string): IIssueEvent => ({
  created_at: createdAt,
  event: 'labeled',
  label: {name: label},
  actor: {login: 'octocat', type: 'User'}
});

test('bot activity does not remove the stale label when ignore-bot-updates is enabled', async () => {
  expect.assertions(2);
  const opts = {
    ...DefaultProcessorOptions,
    ignoreBotUpdates: true,
    daysBeforeClose: 7,
    removeStaleWhenUpdated: true
  };
  const markedStaleOn = daysAgo(2);
  // A bot commented after the stale marking: updated_at is fresh.
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A stale issue touched only by bots',
      daysAgo(1), // updated_at bumped by the bot
      daysAgo(40),
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
    async () => ({
      creationDate: markedStaleOn,
      events: [
        botLabeledEvent(markedStaleOn, 'Stale'),
        botCommentedEvent(daysAgo(1))
      ]
    })
  );

  await processor.processIssues(1);

  expect(processor.removedLabelIssues).toHaveLength(0);
  expect(processor.closedIssues).toHaveLength(0); // warned 2d ago; close window is 7d
});

test('stale issue closes despite recent bot activity when ignore-bot-updates is enabled', async () => {
  expect.assertions(1);
  const opts = {
    ...DefaultProcessorOptions,
    ignoreBotUpdates: true,
    daysBeforeClose: 7,
    removeStaleWhenUpdated: true
  };
  const markedStaleOn = daysAgo(10); // warned 10d ago > 7d close window
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A stale issue that bots keep touching',
      daysAgo(1), // bots keep updated_at perpetually fresh
      daysAgo(60),
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
    async () => ({
      creationDate: markedStaleOn,
      events: [
        botLabeledEvent(markedStaleOn, 'Stale'),
        botCommentedEvent(daysAgo(3)),
        botCommentedEvent(daysAgo(1))
      ]
    })
  );

  await processor.processIssues(1);

  expect(processor.closedIssues).toHaveLength(1);
});

test('human labeling still removes the stale label when ignore-bot-updates is enabled', async () => {
  expect.assertions(2);
  const opts = {
    ...DefaultProcessorOptions,
    ignoreBotUpdates: true,
    daysBeforeClose: 7,
    removeStaleWhenUpdated: true
  };
  const markedStaleOn = daysAgo(10);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A stale issue a human labeled after the marking',
      daysAgo(1),
      daysAgo(60),
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
    async () => ({
      creationDate: markedStaleOn,
      events: [
        botLabeledEvent(markedStaleOn, 'Stale'),
        humanLabeledEvent(daysAgo(1), 'priority')
      ]
    })
  );

  await processor.processIssues(1);

  expect(processor.removedLabelIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('a commit pushed after the stale marking blocks closing a PR when ignore-bot-updates is enabled', async () => {
  expect.assertions(2);
  const opts = {
    ...DefaultProcessorOptions,
    ignoreBotUpdates: true,
    daysBeforeClose: 7,
    removeStaleWhenUpdated: true
  };
  const markedStaleOn = daysAgo(10);
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A stale PR whose author pushed yesterday',
      daysAgo(1),
      daysAgo(60),
      false,
      true, // pull request
      ['Stale']
    )
  ];
  const processor = new IssuesProcessorMock(
    opts,
    alwaysFalseStateMock,
    async p => (p === 1 ? TestIssueList : []),
    async () => [],
    async () => ({
      creationDate: markedStaleOn,
      events: [botLabeledEvent(markedStaleOn, 'Stale')]
    })
  );
  processor.getPullRequestLastCommitDate = async () => daysAgo(1);

  await processor.processIssues(1);

  // The push counts as a human update: un-stale, don't close.
  expect(processor.removedLabelIssues).toHaveLength(1);
  expect(processor.closedIssues).toHaveLength(0);
});

test('default behavior is unchanged when ignore-bot-updates is disabled', async () => {
  expect.assertions(2);
  const opts = {
    ...DefaultProcessorOptions,
    ignoreBotUpdates: false,
    daysBeforeClose: 7,
    removeStaleWhenUpdated: true
  };
  const markedStaleOn = daysAgo(10);
  // Same shape as the "closes despite bots" test above — but with the option
  // off, the bot comment resets everything, exactly as before.
  const TestIssueList: Issue[] = [
    generateIssue(
      opts,
      1,
      'A stale issue that bots keep touching',
      daysAgo(1),
      daysAgo(60),
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
    async () => ({
      creationDate: markedStaleOn,
      events: [
        botLabeledEvent(markedStaleOn, 'Stale'),
        botCommentedEvent(daysAgo(1))
      ]
    })
  );

  await processor.processIssues(1);

  expect(processor.removedLabelIssues).toHaveLength(1); // updated_at bump un-stales
  expect(processor.closedIssues).toHaveLength(0);
});
