import {DefaultProcessorOptions} from '../../__tests__/constants/default-processor-options';
import {generateIIssue} from '../../__tests__/functions/generate-iissue';
import {IIssue} from '../interfaces/issue';
import {IIssueEvent} from '../interfaces/issue-event';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {IgnoredLabels} from './ignored-labels';
import {Issue} from './issue';

describe('IgnoredLabels', (): void => {
  let ignoredLabels: IgnoredLabels;
  let optionsInterface: IIssuesProcessorOptions;
  let issue: Issue;
  let issueInterface: IIssue;

  beforeEach((): void => {
    optionsInterface = {
      ...DefaultProcessorOptions
    };
    issueInterface = generateIIssue();
  });

  describe('getIgnoredLabels()', (): void => {
    describe('when the given issue is not a pull request', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = undefined;
      });

      it('should always return an empty array for issues', (): void => {
        expect.assertions(1);
        optionsInterface.ignoreLabelsActivityUpdatesOnPr =
          'bot-label, automated';
        issue = new Issue(optionsInterface, issueInterface);
        ignoredLabels = new IgnoredLabels(optionsInterface, issue);

        const result = ignoredLabels.getIgnoredLabels();

        expect(result).toStrictEqual([]);
      });
    });

    describe('when the given issue is a pull request', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = {};
      });

      describe('when no ignore options are set', (): void => {
        it('should return an empty array', (): void => {
          expect.assertions(1);
          issue = new Issue(optionsInterface, issueInterface);
          ignoredLabels = new IgnoredLabels(optionsInterface, issue);

          const result = ignoredLabels.getIgnoredLabels();

          expect(result).toStrictEqual([]);
        });
      });

      describe('when ignoreLabelsActivityUpdatesOnPr is set', (): void => {
        beforeEach((): void => {
          optionsInterface.ignoreLabelsActivityUpdatesOnPr =
            'pr-bot, merges-blocked';
        });

        it('should return the labels from ignoreLabelsActivityUpdatesOnPr', (): void => {
          expect.assertions(1);
          issue = new Issue(optionsInterface, issueInterface);
          ignoredLabels = new IgnoredLabels(optionsInterface, issue);

          const result = ignoredLabels.getIgnoredLabels();

          expect(result).toStrictEqual(['pr-bot', 'merges-blocked']);
        });
      });
    });
  });

  describe('getEffectiveUpdateDate()', (): void => {
    let events: IIssueEvent[];

    beforeEach((): void => {
      issueInterface.pull_request = {}; // Make it a PR so the logic applies
      issueInterface.created_at = '2020-01-01T00:00:00Z';
      issueInterface.updated_at = '2020-01-10T00:00:00Z';
    });

    describe('when no labels are ignored', (): void => {
      beforeEach((): void => {
        optionsInterface.ignoreLabelsActivityUpdatesOnPr = '';
      });

      it('should return the original updated_at date', (): void => {
        expect.assertions(1);
        issue = new Issue(optionsInterface, issueInterface);
        ignoredLabels = new IgnoredLabels(optionsInterface, issue);
        events = [];

        const result = ignoredLabels.getEffectiveUpdateDate(events);

        expect(result).toBe('2020-01-10T00:00:00Z');
      });
    });

    describe('when labels are ignored', (): void => {
      beforeEach((): void => {
        optionsInterface.ignoreLabelsActivityUpdatesOnPr =
          'bot-label, merges-blocked';
      });

      describe('when there are no events', (): void => {
        it('should return the original updated_at date', (): void => {
          expect.assertions(1);
          issue = new Issue(optionsInterface, issueInterface);
          ignoredLabels = new IgnoredLabels(optionsInterface, issue);
          events = [];

          const result = ignoredLabels.getEffectiveUpdateDate(events);

          expect(result).toBe('2020-01-10T00:00:00Z');
        });
      });

      describe('when all events are ignored label events', (): void => {
        beforeEach((): void => {
          events = [
            {
              event: 'labeled',
              created_at: '2020-01-05T00:00:00Z',
              label: {name: 'bot-label'}
            },
            {
              event: 'labeled',
              created_at: '2020-01-08T00:00:00Z',
              label: {name: 'merges-blocked'}
            }
          ];
        });

        it('should return the creation date', (): void => {
          expect.assertions(1);
          issue = new Issue(optionsInterface, issueInterface);
          ignoredLabels = new IgnoredLabels(optionsInterface, issue);

          const result = ignoredLabels.getEffectiveUpdateDate(events);

          expect(result).toBe('2020-01-01T00:00:00Z');
        });
      });

      describe('when there are mixed events', (): void => {
        beforeEach((): void => {
          events = [
            {
              event: 'commented',
              created_at: '2020-01-03T00:00:00Z',
              label: {name: ''}
            },
            {
              event: 'labeled',
              created_at: '2020-01-05T00:00:00Z',
              label: {name: 'bot-label'}
            },
            {
              event: 'labeled',
              created_at: '2020-01-06T00:00:00Z',
              label: {name: 'needs-review'}
            },
            {
              event: 'labeled',
              created_at: '2020-01-08T00:00:00Z',
              label: {name: 'merges-blocked'}
            }
          ];
        });

        it('should return the most recent non-ignored event date', (): void => {
          expect.assertions(1);
          issue = new Issue(optionsInterface, issueInterface);
          ignoredLabels = new IgnoredLabels(optionsInterface, issue);

          const result = ignoredLabels.getEffectiveUpdateDate(events);

          // Most recent non-ignored event is 'needs-review' at 2020-01-06
          expect(result).toBe('2020-01-06T00:00:00Z');
        });
      });

      describe('when there are unlabeled events for ignored labels', (): void => {
        beforeEach((): void => {
          events = [
            {
              event: 'labeled',
              created_at: '2020-01-03T00:00:00Z',
              label: {name: 'needs-review'}
            },
            {
              event: 'unlabeled',
              created_at: '2020-01-05T00:00:00Z',
              label: {name: 'bot-label'}
            }
          ];
        });

        it('should ignore unlabeled events for ignored labels', (): void => {
          expect.assertions(1);
          issue = new Issue(optionsInterface, issueInterface);
          ignoredLabels = new IgnoredLabels(optionsInterface, issue);

          const result = ignoredLabels.getEffectiveUpdateDate(events);

          // Most recent non-ignored event is 'needs-review' at 2020-01-03
          expect(result).toBe('2020-01-03T00:00:00Z');
        });
      });

      describe('when label names have different casing', (): void => {
        beforeEach((): void => {
          optionsInterface.ignoreLabelsActivityUpdatesOnPr =
            'Bot-Label, MERGES-BLOCKED';
          events = [
            {
              event: 'labeled',
              created_at: '2020-01-03T00:00:00Z',
              label: {name: 'needs-review'}
            },
            {
              event: 'labeled',
              created_at: '2020-01-05T00:00:00Z',
              label: {name: 'bot-label'}
            },
            {
              event: 'labeled',
              created_at: '2020-01-08T00:00:00Z',
              label: {name: 'Merges-Blocked'}
            }
          ];
        });

        it('should ignore labels case-insensitively', (): void => {
          expect.assertions(1);
          issue = new Issue(optionsInterface, issueInterface);
          ignoredLabels = new IgnoredLabels(optionsInterface, issue);

          const result = ignoredLabels.getEffectiveUpdateDate(events);

          // Most recent non-ignored event is 'needs-review' at 2020-01-03
          expect(result).toBe('2020-01-03T00:00:00Z');
        });
      });

      describe('when there are non-label events after ignored label events', (): void => {
        beforeEach((): void => {
          events = [
            {
              event: 'labeled',
              created_at: '2020-01-05T00:00:00Z',
              label: {name: 'bot-label'}
            },
            {
              event: 'committed',
              created_at: '2020-01-07T00:00:00Z',
              label: {name: ''}
            },
            {
              event: 'labeled',
              created_at: '2020-01-08T00:00:00Z',
              label: {name: 'merges-blocked'}
            }
          ];
        });

        it('should return the most recent non-label event', (): void => {
          expect.assertions(1);
          issue = new Issue(optionsInterface, issueInterface);
          ignoredLabels = new IgnoredLabels(optionsInterface, issue);

          const result = ignoredLabels.getEffectiveUpdateDate(events);

          // Most recent non-ignored event is 'committed' at 2020-01-07
          expect(result).toBe('2020-01-07T00:00:00Z');
        });
      });
    });
  });
});
