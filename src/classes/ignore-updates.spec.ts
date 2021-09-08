import {DefaultProcessorOptions} from '../../__tests__/constants/default-processor-options';
import {generateIIssue} from '../../__tests__/functions/generate-iissue';
import {IIssue} from '../interfaces/issue';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {IgnoreUpdates} from './ignore-updates';
import {Issue} from './issue';

describe('IgnoreUpdates', (): void => {
  let ignoreUpdates: IgnoreUpdates;
  let optionsInterface: IIssuesProcessorOptions;
  let issue: Issue;
  let issueInterface: IIssue;

  beforeEach((): void => {
    optionsInterface = {
      ...DefaultProcessorOptions,
      ignoreIssueUpdates: true
    };
    issueInterface = generateIIssue();
  });

  describe('shouldIgnoreUpdates()', (): void => {
    describe('when the given issue is not a pull request', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = undefined;
      });

      describe('when the given options are configured to reset the stale on updates', (): void => {
        beforeEach((): void => {
          optionsInterface.ignoreUpdates = false;
        });

        describe('when the given options are not configured to reset the issue stale on updates', (): void => {
          beforeEach((): void => {
            delete optionsInterface.ignoreIssueUpdates;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreUpdates = new IgnoreUpdates(optionsInterface, issue);

            const result = ignoreUpdates.shouldIgnoreUpdates();

            expect(result).toStrictEqual(false);
          });
        });

        describe('when the given options are configured to reset the issue stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.ignoreIssueUpdates = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreUpdates = new IgnoreUpdates(optionsInterface, issue);

            const result = ignoreUpdates.shouldIgnoreUpdates();

            expect(result).toStrictEqual(false);
          });
        });

        describe('when the given options are configured to not reset the issue stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.ignoreIssueUpdates = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreUpdates = new IgnoreUpdates(optionsInterface, issue);

            const result = ignoreUpdates.shouldIgnoreUpdates();

            expect(result).toStrictEqual(true);
          });
        });
      });

      describe('when the given options are configured to reset the stale on updates', (): void => {
        beforeEach((): void => {
          optionsInterface.ignoreUpdates = true;
        });

        describe('when the given options are not configured to reset the issue stale on updates', (): void => {
          beforeEach((): void => {
            delete optionsInterface.ignoreIssueUpdates;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreUpdates = new IgnoreUpdates(optionsInterface, issue);

            const result = ignoreUpdates.shouldIgnoreUpdates();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to reset the issue stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.ignoreIssueUpdates = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreUpdates = new IgnoreUpdates(optionsInterface, issue);

            const result = ignoreUpdates.shouldIgnoreUpdates();

            expect(result).toStrictEqual(false);
          });
        });

        describe('when the given options are configured to not reset the issue stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.ignoreIssueUpdates = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreUpdates = new IgnoreUpdates(optionsInterface, issue);

            const result = ignoreUpdates.shouldIgnoreUpdates();

            expect(result).toStrictEqual(true);
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
          optionsInterface.ignoreUpdates = false;
        });

        describe('when the given options are not configured to reset the pull request stale on updates', (): void => {
          beforeEach((): void => {
            delete optionsInterface.ignorePrUpdates;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreUpdates = new IgnoreUpdates(optionsInterface, issue);

            const result = ignoreUpdates.shouldIgnoreUpdates();

            expect(result).toStrictEqual(false);
          });
        });

        describe('when the given options are configured to reset the pull request stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.ignorePrUpdates = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreUpdates = new IgnoreUpdates(optionsInterface, issue);

            const result = ignoreUpdates.shouldIgnoreUpdates();

            expect(result).toStrictEqual(false);
          });
        });

        describe('when the given options are configured to not reset the pull request stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.ignorePrUpdates = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreUpdates = new IgnoreUpdates(optionsInterface, issue);

            const result = ignoreUpdates.shouldIgnoreUpdates();

            expect(result).toStrictEqual(true);
          });
        });
      });

      describe('when the given options are configured to not reset the stale on updates', (): void => {
        beforeEach((): void => {
          optionsInterface.ignoreUpdates = true;
        });

        describe('when the given options are not configured to reset the pull request stale on updates', (): void => {
          beforeEach((): void => {
            delete optionsInterface.ignorePrUpdates;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreUpdates = new IgnoreUpdates(optionsInterface, issue);

            const result = ignoreUpdates.shouldIgnoreUpdates();

            expect(result).toStrictEqual(true);
          });
        });

        describe('when the given options are configured to reset the pull request stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.ignorePrUpdates = false;
          });

          it('should return false', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreUpdates = new IgnoreUpdates(optionsInterface, issue);

            const result = ignoreUpdates.shouldIgnoreUpdates();

            expect(result).toStrictEqual(false);
          });
        });

        describe('when the given options are configured to not reset the pull request stale on updates', (): void => {
          beforeEach((): void => {
            optionsInterface.ignorePrUpdates = true;
          });

          it('should return true', (): void => {
            expect.assertions(1);
            issue = new Issue(optionsInterface, issueInterface);
            ignoreUpdates = new IgnoreUpdates(optionsInterface, issue);

            const result = ignoreUpdates.shouldIgnoreUpdates();

            expect(result).toStrictEqual(true);
          });
        });
      });
    });
  });
});
