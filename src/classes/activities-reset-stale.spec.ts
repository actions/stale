import {DefaultProcessorOptions} from '../../__tests__/constants/default-processor-options';
import {generateIIssue} from '../../__tests__/functions/generate-iissue';
import {IIssue} from '../interfaces/issue';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {ActivitiesResetStale} from './activities-reset-stale';
import {Issue} from './issue';

describe('ActivitiesResetStale', (): void => {
  let activitiesResetStale: ActivitiesResetStale;
  let optionsInterface: IIssuesProcessorOptions;
  let issue: Issue;
  let issueInterface: IIssue;

  beforeEach((): void => {
    optionsInterface = {
      ...DefaultProcessorOptions,
      issueActivitiesResetStale: false
    };
    issueInterface = generateIIssue();
  });

  describe('shouldActivitiesResetStale()', (): void => {
    describe('when the given issue is not a pull request', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = undefined;
      });

      describe('when the given options are configured to reset the stale on updates', (): void => {
        beforeEach((): void => {
          optionsInterface.activitiesResetStale = true;
        });

        describe('when the given options are not configured to reset the issue stale on updates', (): void => {
          beforeEach((): void => {
            delete optionsInterface.issueActivitiesResetStale;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            activitiesResetStale = new ActivitiesResetStale(
              optionsInterface,
              issue
            );

            const result = activitiesResetStale.shouldActivitiesResetStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to reset the issue stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.issueActivitiesResetStale = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            activitiesResetStale = new ActivitiesResetStale(
              optionsInterface,
              issue
            );

            const result = activitiesResetStale.shouldActivitiesResetStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to not reset the issue stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.issueActivitiesResetStale = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            activitiesResetStale = new ActivitiesResetStale(
              optionsInterface,
              issue
            );

            const result = activitiesResetStale.shouldActivitiesResetStale();

            expect(result).toStrictEqual(false);
          });
        });
      });

      describe('when the given options are configured to reset the stale on updates', (): void => {
        beforeEach((): void => {
          optionsInterface.activitiesResetStale = false;
        });

        describe('when the given options are not configured to reset the issue stale on updates', (): void => {
          beforeEach((): void => {
            delete optionsInterface.issueActivitiesResetStale;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            activitiesResetStale = new ActivitiesResetStale(
              optionsInterface,
              issue
            );

            const result = activitiesResetStale.shouldActivitiesResetStale();

            expect(result).toStrictEqual(false);
          });
        });

        describe('when the given options are configured to reset the issue stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.issueActivitiesResetStale = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            activitiesResetStale = new ActivitiesResetStale(
              optionsInterface,
              issue
            );

            const result = activitiesResetStale.shouldActivitiesResetStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to not reset the issue stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.issueActivitiesResetStale = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            activitiesResetStale = new ActivitiesResetStale(
              optionsInterface,
              issue
            );

            const result = activitiesResetStale.shouldActivitiesResetStale();

            expect(result).toStrictEqual(false);
          });
        });
      });
    });

    describe('when the given issue is a pull request', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = {};
      });

      describe('when the given options are configured to reset the stale on updates', (): void => {
        beforeEach((): void => {
          optionsInterface.activitiesResetStale = true;
        });

        describe('when the given options are not configured to reset the pull request stale on updates', (): void => {
          beforeEach((): void => {
            delete optionsInterface.prActivitiesResetStale;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            activitiesResetStale = new ActivitiesResetStale(
              optionsInterface,
              issue
            );

            const result = activitiesResetStale.shouldActivitiesResetStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to reset the pull request stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.prActivitiesResetStale = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            activitiesResetStale = new ActivitiesResetStale(
              optionsInterface,
              issue
            );

            const result = activitiesResetStale.shouldActivitiesResetStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to not reset the pull request stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.prActivitiesResetStale = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            activitiesResetStale = new ActivitiesResetStale(
              optionsInterface,
              issue
            );

            const result = activitiesResetStale.shouldActivitiesResetStale();

            expect(result).toStrictEqual(false);
          });
        });
      });

      describe('when the given options are configured to not reset the stale on updates', (): void => {
        beforeEach((): void => {
          optionsInterface.activitiesResetStale = false;
        });

        describe('when the given options are not configured to reset the pull request stale on updates', (): void => {
          beforeEach((): void => {
            delete optionsInterface.prActivitiesResetStale;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            activitiesResetStale = new ActivitiesResetStale(
              optionsInterface,
              issue
            );

            const result = activitiesResetStale.shouldActivitiesResetStale();

            expect(result).toStrictEqual(false);
          });
        });

        describe('when the given options are configured to reset the pull request stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.prActivitiesResetStale = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            activitiesResetStale = new ActivitiesResetStale(
              optionsInterface,
              issue
            );

            const result = activitiesResetStale.shouldActivitiesResetStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to not reset the pull request stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.prActivitiesResetStale = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            activitiesResetStale = new ActivitiesResetStale(
              optionsInterface,
              issue
            );

            const result = activitiesResetStale.shouldActivitiesResetStale();

            expect(result).toStrictEqual(false);
          });
        });
      });
    });
  });
});
