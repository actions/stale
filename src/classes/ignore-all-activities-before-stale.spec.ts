import {DefaultProcessorOptions} from '../../__tests__/constants/default-processor-options';
import {generateIIssue} from '../../__tests__/functions/generate-iissue';
import {IIssue} from '../interfaces/issue';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {IgnoreAllActivitiesBeforeStale} from './ignore-all-activities-before-stale';
import {Issue} from './issue';

describe('IgnoreAllActivitiesBeforeStale', (): void => {
  let ignoreAllActivitiesBeforeStale: IgnoreAllActivitiesBeforeStale;
  let optionsInterface: IIssuesProcessorOptions;
  let issue: Issue;
  let issueInterface: IIssue;

  beforeEach((): void => {
    optionsInterface = {
      ...DefaultProcessorOptions,
      ignoreAllIssueActivitiesBeforeStale: false
    };
    issueInterface = generateIIssue();
  });

  describe('shouldIgnoreAllActivitiesBeforeStale()', (): void => {
    describe('when the given issue is not a pull request', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = undefined;
      });

      describe('when the given options are configured to ignore all activities before stale', (): void => {
        beforeEach((): void => {
          optionsInterface.ignoreAllActivitiesBeforeStale = true;
        });

        describe('when the given options are not configured to ignore all issue activities before stale', (): void => {
          beforeEach((): void => {
            delete optionsInterface.ignoreAllIssueActivitiesBeforeStale;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreAllActivitiesBeforeStale = new IgnoreAllActivitiesBeforeStale(
              optionsInterface,
              issue
            );

            const result =
              ignoreAllActivitiesBeforeStale.shouldIgnoreAllActivitiesBeforeStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to ignore all issue activities before stale', (): void => {
          beforeEach((): void => {
            optionsInterface.ignoreAllIssueActivitiesBeforeStale = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreAllActivitiesBeforeStale = new IgnoreAllActivitiesBeforeStale(
              optionsInterface,
              issue
            );

            const result =
              ignoreAllActivitiesBeforeStale.shouldIgnoreAllActivitiesBeforeStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to not ignore all issue activities before stale', (): void => {
          beforeEach((): void => {
            optionsInterface.ignoreAllIssueActivitiesBeforeStale = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreAllActivitiesBeforeStale = new IgnoreAllActivitiesBeforeStale(
              optionsInterface,
              issue
            );

            const result =
              ignoreAllActivitiesBeforeStale.shouldIgnoreAllActivitiesBeforeStale();

            expect(result).toStrictEqual(false);
          });
        });
      });

      describe('when the given options are configured to not ignore all activities before stale', (): void => {
        beforeEach((): void => {
          optionsInterface.ignoreAllActivitiesBeforeStale = false;
        });

        describe('when the given options are not configured to ignore all issue activities before stale', (): void => {
          beforeEach((): void => {
            delete optionsInterface.ignoreAllIssueActivitiesBeforeStale;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreAllActivitiesBeforeStale = new IgnoreAllActivitiesBeforeStale(
              optionsInterface,
              issue
            );

            const result =
              ignoreAllActivitiesBeforeStale.shouldIgnoreAllActivitiesBeforeStale();

            expect(result).toStrictEqual(false);
          });
        });

        describe('when the given options are configured to ignore all issue activities before stale', (): void => {
          beforeEach((): void => {
            optionsInterface.ignoreAllIssueActivitiesBeforeStale = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreAllActivitiesBeforeStale = new IgnoreAllActivitiesBeforeStale(
              optionsInterface,
              issue
            );

            const result =
              ignoreAllActivitiesBeforeStale.shouldIgnoreAllActivitiesBeforeStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to not ignore all issue activities before stale', (): void => {
          beforeEach((): void => {
            optionsInterface.ignoreAllIssueActivitiesBeforeStale = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreAllActivitiesBeforeStale = new IgnoreAllActivitiesBeforeStale(
              optionsInterface,
              issue
            );

            const result =
              ignoreAllActivitiesBeforeStale.shouldIgnoreAllActivitiesBeforeStale();

            expect(result).toStrictEqual(false);
          });
        });
      });
    });

    describe('when the given issue is a pull request', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = {};
      });

      describe('when the given options are configured to ignore all activities before stale', (): void => {
        beforeEach((): void => {
          optionsInterface.ignoreAllActivitiesBeforeStale = true;
        });

        describe('when the given options are not configured to ignore all pull request activities before stale', (): void => {
          beforeEach((): void => {
            delete optionsInterface.ignoreAllPrActivitiesBeforeStale;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreAllActivitiesBeforeStale = new IgnoreAllActivitiesBeforeStale(
              optionsInterface,
              issue
            );

            const result =
              ignoreAllActivitiesBeforeStale.shouldIgnoreAllActivitiesBeforeStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to ignore all pull request activities before stale', (): void => {
          beforeEach((): void => {
            optionsInterface.ignoreAllPrActivitiesBeforeStale = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreAllActivitiesBeforeStale = new IgnoreAllActivitiesBeforeStale(
              optionsInterface,
              issue
            );

            const result =
              ignoreAllActivitiesBeforeStale.shouldIgnoreAllActivitiesBeforeStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to not ignore all pull request activities before stale', (): void => {
          beforeEach((): void => {
            optionsInterface.ignoreAllPrActivitiesBeforeStale = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreAllActivitiesBeforeStale = new IgnoreAllActivitiesBeforeStale(
              optionsInterface,
              issue
            );

            const result =
              ignoreAllActivitiesBeforeStale.shouldIgnoreAllActivitiesBeforeStale();

            expect(result).toStrictEqual(false);
          });
        });
      });

      describe('when the given options are configured to not ignore all activities before stale', (): void => {
        beforeEach((): void => {
          optionsInterface.ignoreAllActivitiesBeforeStale = false;
        });

        describe('when the given options are not configured to ignore all pull request activities before stale', (): void => {
          beforeEach((): void => {
            delete optionsInterface.ignoreAllPrActivitiesBeforeStale;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreAllActivitiesBeforeStale = new IgnoreAllActivitiesBeforeStale(
              optionsInterface,
              issue
            );

            const result =
              ignoreAllActivitiesBeforeStale.shouldIgnoreAllActivitiesBeforeStale();

            expect(result).toStrictEqual(false);
          });
        });

        describe('when the given options are configured to ignore all pull request activities before stale', (): void => {
          beforeEach((): void => {
            optionsInterface.ignoreAllPrActivitiesBeforeStale = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreAllActivitiesBeforeStale = new IgnoreAllActivitiesBeforeStale(
              optionsInterface,
              issue
            );

            const result =
              ignoreAllActivitiesBeforeStale.shouldIgnoreAllActivitiesBeforeStale();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to not ignore all pull request activities before stale', (): void => {
          beforeEach((): void => {
            optionsInterface.ignoreAllPrActivitiesBeforeStale = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreAllActivitiesBeforeStale = new IgnoreAllActivitiesBeforeStale(
              optionsInterface,
              issue
            );

            const result =
              ignoreAllActivitiesBeforeStale.shouldIgnoreAllActivitiesBeforeStale();

            expect(result).toStrictEqual(false);
          });
        });
      });
    });
  });
});
