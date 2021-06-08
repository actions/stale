import {DefaultProcessorOptions} from '../../__tests__/constants/default-processor-options';
import {generateIIssue} from '../../__tests__/functions/generate-iissue';
import {IIssue} from '../interfaces/issue';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {UpdatesResetStale} from './updates-reset-stale';
import {Issue} from './issue';

describe('UpdatesResetStale', (): void => {
  let updatesResetStale: UpdatesResetStale;
  let optionsInterface: IIssuesProcessorOptions;
  let issue: Issue;
  let issueInterface: IIssue;

  beforeEach((): void => {
    optionsInterface = {
      ...DefaultProcessorOptions,
      issueUpdatesResetStale: false
    };
    issueInterface = generateIIssue();
  });

  describe('shouldUpdatesResetStale()', (): void => {
    describe('when the given issue is not a pull request', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = undefined;
      });

      describe('when the given options are configured to updates reset stale', (): void => {
        beforeEach((): void => {
          optionsInterface.updatesResetStale = true;
        });

        describe('when the given options are not configured to issue updates reset stale', (): void => {
          beforeEach((): void => {
            delete optionsInterface.issueUpdatesResetStale;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            updatesResetStale = new UpdatesResetStale(optionsInterface, issue);

            const result = updatesResetStale.shouldUpdatesResetStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to issue updates reset stale', (): void => {
          beforeEach((): void => {
            optionsInterface.issueUpdatesResetStale = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            updatesResetStale = new UpdatesResetStale(optionsInterface, issue);

            const result = updatesResetStale.shouldUpdatesResetStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to not issue updates reset stale', (): void => {
          beforeEach((): void => {
            optionsInterface.issueUpdatesResetStale = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            updatesResetStale = new UpdatesResetStale(optionsInterface, issue);

            const result = updatesResetStale.shouldUpdatesResetStale();

            expect(result).toStrictEqual(false);
          });
        });
      });

      describe('when the given options are configured to not updates reset stale', (): void => {
        beforeEach((): void => {
          optionsInterface.updatesResetStale = false;
        });

        describe('when the given options are not configured to issue updates reset stale', (): void => {
          beforeEach((): void => {
            delete optionsInterface.issueUpdatesResetStale;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            updatesResetStale = new UpdatesResetStale(optionsInterface, issue);

            const result = updatesResetStale.shouldUpdatesResetStale();

            expect(result).toStrictEqual(false);
          });
        });

        describe('when the given options are configured to issue updates reset stale', (): void => {
          beforeEach((): void => {
            optionsInterface.issueUpdatesResetStale = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            updatesResetStale = new UpdatesResetStale(optionsInterface, issue);

            const result = updatesResetStale.shouldUpdatesResetStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to not issue updates reset stale', (): void => {
          beforeEach((): void => {
            optionsInterface.issueUpdatesResetStale = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            updatesResetStale = new UpdatesResetStale(optionsInterface, issue);

            const result = updatesResetStale.shouldUpdatesResetStale();

            expect(result).toStrictEqual(false);
          });
        });
      });
    });

    describe('when the given issue is a pull request', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = {};
      });

      describe('when the given options are configured to updates reset stale', (): void => {
        beforeEach((): void => {
          optionsInterface.updatesResetStale = true;
        });

        describe('when the given options are not configured to pull request updates reset stale', (): void => {
          beforeEach((): void => {
            delete optionsInterface.prUpdatesResetStale;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            updatesResetStale = new UpdatesResetStale(optionsInterface, issue);

            const result = updatesResetStale.shouldUpdatesResetStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to pull request updates reset stale', (): void => {
          beforeEach((): void => {
            optionsInterface.prUpdatesResetStale = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            updatesResetStale = new UpdatesResetStale(optionsInterface, issue);

            const result = updatesResetStale.shouldUpdatesResetStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to not pull request updates reset stale', (): void => {
          beforeEach((): void => {
            optionsInterface.prUpdatesResetStale = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            updatesResetStale = new UpdatesResetStale(optionsInterface, issue);

            const result = updatesResetStale.shouldUpdatesResetStale();

            expect(result).toStrictEqual(false);
          });
        });
      });

      describe('when the given options are configured to not updates reset stale', (): void => {
        beforeEach((): void => {
          optionsInterface.updatesResetStale = false;
        });

        describe('when the given options are not configured to pull request updates reset stale', (): void => {
          beforeEach((): void => {
            delete optionsInterface.prUpdatesResetStale;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            updatesResetStale = new UpdatesResetStale(optionsInterface, issue);

            const result = updatesResetStale.shouldUpdatesResetStale();

            expect(result).toStrictEqual(false);
          });
        });

        describe('when the given options are configured to pull request updates reset stale', (): void => {
          beforeEach((): void => {
            optionsInterface.prUpdatesResetStale = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            updatesResetStale = new UpdatesResetStale(optionsInterface, issue);

            const result = updatesResetStale.shouldUpdatesResetStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to not pull request updates reset stale', (): void => {
          beforeEach((): void => {
            optionsInterface.prUpdatesResetStale = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            updatesResetStale = new UpdatesResetStale(optionsInterface, issue);

            const result = updatesResetStale.shouldUpdatesResetStale();

            expect(result).toStrictEqual(false);
          });
        });
      });
    });
  });
});
