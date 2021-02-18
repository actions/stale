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
    optionsInterface = {
      ascending: false,
      closeIssueLabel: '',
      closeIssueMessage: '',
      closePrLabel: '',
      closePrMessage: '',
      daysBeforeClose: 0,
      daysBeforeIssueClose: 0,
      daysBeforeIssueStale: 0,
      daysBeforePrClose: 0,
      daysBeforePrStale: 0,
      daysBeforeStale: 0,
      debugOnly: false,
      deleteBranch: false,
      exemptIssueLabels: '',
      exemptPrLabels: '',
      onlyLabels: '',
      operationsPerRun: 0,
      removeStaleWhenUpdated: false,
      repoToken: '',
      skipStaleIssueMessage: false,
      skipStalePrMessage: false,
      staleIssueLabel: '',
      staleIssueMessage: '',
      stalePrLabel: '',
      stalePrMessage: '',
      startDate: undefined,
      exemptIssueMilestones: '',
      exemptPrMilestones: '',
      exemptMilestones: '',
      exemptAllMilestones: false,
      exemptAllIssueMilestones: undefined,
      exemptAllPrMilestones: undefined
    };
    issueInterface = {
      created_at: '',
      locked: false,
      milestone: undefined,
      number: 0,
      pull_request: undefined,
      state: '',
      title: '',
      updated_at: '',
      labels: []
    };
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
