import {DefaultProcessorOptions} from '../../__tests__/constants/default-processor-options';
import {generateIIssue} from '../../__tests__/functions/generate-iissue';
import {IIssue} from '../interfaces/issue';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {Issue} from './issue';
import {Milestones} from './milestones';

describe('Milestones', (): void => {
  let milestones: Milestones;
  let optionsInterface: IIssuesProcessorOptions;
  let issue: Issue;
  let issueInterface: IIssue;

  beforeEach((): void => {
    optionsInterface = {...DefaultProcessorOptions};
    issueInterface = generateIIssue();
  });

  describe('shouldExemptMilestones()', (): void => {
    describe('when the given issue is not a pull request', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = undefined;
      });

      describe('when the given options are not configured to exempt a milestone', (): void => {
        beforeEach((): void => {
          optionsInterface.exemptMilestones = '';
        });

        describe('when the given options are not configured to exempt an issue milestone', (): void => {
          beforeEach((): void => {
            optionsInterface.exemptIssueMilestones = '';
          });

          describe('when the given issue does not have a milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = undefined;
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-title'
              };
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });
        });

        describe('when the given options are configured to exempt an issue milestone', (): void => {
          beforeEach((): void => {
            optionsInterface.exemptIssueMilestones =
              'dummy-exempt-issue-milestone';
          });

          describe('when the given issue does not have a milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = undefined;
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone different than the exempt issue milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-title'
              };
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone equaling the exempt issue milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-exempt-issue-milestone'
              };
            });

            it('should return true', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(true);
            });
          });
        });
      });

      describe('when the given options are configured to exempt a milestone', (): void => {
        beforeEach((): void => {
          optionsInterface.exemptMilestones = 'dummy-exempt-milestone';
        });

        describe('when the given options are not configured to exempt an issue milestone', (): void => {
          beforeEach((): void => {
            optionsInterface.exemptIssueMilestones = '';
          });

          describe('when the given issue does not have a milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = undefined;
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone different than the exempt milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-title'
              };
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone equaling the exempt milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-exempt-milestone'
              };
            });

            it('should return true', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(true);
            });
          });
        });

        describe('when the given options are configured to exempt an issue milestone', (): void => {
          beforeEach((): void => {
            optionsInterface.exemptIssueMilestones =
              'dummy-exempt-issue-milestone';
          });

          describe('when the given issue does not have a milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = undefined;
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone different than the exempt issue milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-title'
              };
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone equaling the exempt issue milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-exempt-issue-milestone'
              };
            });

            it('should return true', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(true);
            });
          });

          describe('when the given issue does have a milestone different than the exempt milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-title'
              };
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone equaling the exempt milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-exempt-milestone'
              };
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });
        });
      });
    });

    describe('when the given issue is a pull request', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = {};
      });

      describe('when the given options are not configured to exempt a milestone', (): void => {
        beforeEach((): void => {
          optionsInterface.exemptMilestones = '';
        });

        describe('when the given options are not configured to exempt a pull request milestone', (): void => {
          beforeEach((): void => {
            optionsInterface.exemptPrMilestones = '';
          });

          describe('when the given issue does not have a milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = undefined;
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-title'
              };
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });
        });

        describe('when the given options are configured to exempt a pull request milestone', (): void => {
          beforeEach((): void => {
            optionsInterface.exemptPrMilestones = 'dummy-exempt-pr-milestone';
          });

          describe('when the given issue does not have a milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = undefined;
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone different than the exempt pull request milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-title'
              };
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone equaling the exempt pull request milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-exempt-pr-milestone'
              };
            });

            it('should return true', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(true);
            });
          });
        });
      });

      describe('when the given options are configured to exempt a milestone', (): void => {
        beforeEach((): void => {
          optionsInterface.exemptMilestones = 'dummy-exempt-milestone';
        });

        describe('when the given options are not configured to exempt a pull request milestone', (): void => {
          beforeEach((): void => {
            optionsInterface.exemptPrMilestones = '';
          });

          describe('when the given issue does not have a milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = undefined;
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone different than the exempt milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-title'
              };
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone equaling the exempt milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-exempt-milestone'
              };
            });

            it('should return true', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(true);
            });
          });
        });

        describe('when the given options are configured to exempt a pull request milestone', (): void => {
          beforeEach((): void => {
            optionsInterface.exemptPrMilestones = 'dummy-exempt-pr-milestone';
          });

          describe('when the given issue does not have a milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = undefined;
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone different than the exempt pull request milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-title'
              };
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone equaling the exempt pull request milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-exempt-pr-milestone'
              };
            });

            it('should return true', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(true);
            });
          });

          describe('when the given issue does have a milestone different than the exempt milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-title'
              };
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });

          describe('when the given issue does have a milestone equaling the exempt milestone', (): void => {
            beforeEach((): void => {
              issueInterface.milestone = {
                title: 'dummy-exempt-milestone'
              };
            });

            it('should return false', (): void => {
              expect.assertions(1);
              issue = new Issue(optionsInterface, issueInterface);
              milestones = new Milestones(optionsInterface, issue);

              const result = milestones.shouldExemptMilestones();

              expect(result).toStrictEqual(false);
            });
          });
        });
      });
    });
  });
});
