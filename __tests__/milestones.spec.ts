import {Issue} from '../src/classes/issue';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';

interface ITestData {
  isPullRequest: boolean;
  milestone: string;
  name: string;
  shouldStale: boolean;
}

describe('milestones options', (): void => {
  let opts: IIssuesProcessorOptions;
  let testIssueList: Issue[];
  let processor: IssuesProcessorMock;

  const setTestIssueList = (
    isPullRequest: boolean,
    milestone: string | undefined
  ) => {
    testIssueList = [
      generateIssue(
        opts,
        1,
        'My first issue',
        '2020-01-01T17:00:00Z',
        '2020-01-01T17:00:00Z',
        isPullRequest,
        undefined,
        undefined,
        undefined,
        milestone
      )
    ];
  };

  const setProcessor = () => {
    processor = new IssuesProcessorMock(
      opts,
      async () => 'abot',
      async p => (p === 1 ? testIssueList : []),
      async () => [],
      async () => new Date().toDateString()
    );
  };

  beforeEach((): void => {
    opts = {...DefaultProcessorOptions};
  });

  describe('when all the issues and pull requests milestones should not exempt', (): void => {
    beforeEach((): void => {
      opts.exemptAllMilestones = false;
    });

    describe.each`
      isPullRequest | milestone            | name                                     | shouldStale
      ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
      ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${true}
      ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
      ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${true}
    `(
      'when $name',
      ({isPullRequest, milestone, shouldStale}: ITestData): void => {
        beforeEach((): void => {
          setTestIssueList(isPullRequest, milestone);
          setProcessor();
        });

        test(`should${
          shouldStale ? '' : ' not'
        } be marked as stale`, async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(
            shouldStale ? 1 : 0
          );
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      }
    );

    describe('when all the issues milestones are not configured to exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = undefined;
      });

      describe.each`
        isPullRequest | milestone            | name                                     | shouldStale
        ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
        ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${true}
        ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
        ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${true}
      `(
        'when $name',
        ({isPullRequest, milestone, shouldStale}: ITestData): void => {
          beforeEach((): void => {
            setTestIssueList(isPullRequest, milestone);
            setProcessor();
          });

          test(`should${
            shouldStale ? '' : ' not'
          } be marked as stale`, async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(
              shouldStale ? 1 : 0
            );
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        }
      );

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${true}
          ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${true}
          ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${true}
            ${false}      | ${'dummy-issue-milestone'}        | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}               | ${true}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${true}
            ${true}       | ${'dummy-issue-milestone'}        | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${true}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                         | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${true}
            ${false}      | ${'dummy-pull-request-milestone'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${true}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${true}
            ${true}       | ${'dummy-pull-request-milestone'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${true}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${true}
          ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${true}
          ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${true}
            ${false}      | ${'dummy-issue-milestone2'}       | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}               | ${true}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${true}
            ${true}       | ${'dummy-issue-milestone2'}       | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${true}
            ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe.each`
            isPullRequest | milestone                          | name                                                                                         | shouldStale
            ${false}      | ${''}                              | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'}  | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${true}
            ${false}      | ${'dummy-pull-request-milestone2'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${true}
            ${false}      | ${'dummy-milestone2'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                              | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'}  | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${true}
            ${true}       | ${'dummy-pull-request-milestone2'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${true}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });
    });

    describe('when all the issues milestones should not exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = false;
      });

      describe.each`
        isPullRequest | milestone            | name                                     | shouldStale
        ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
        ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${true}
        ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
        ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${true}
      `(
        'when $name',
        ({isPullRequest, milestone, shouldStale}: ITestData): void => {
          beforeEach((): void => {
            setTestIssueList(isPullRequest, milestone);
            setProcessor();
          });

          test(`should${
            shouldStale ? '' : ' not'
          } be marked as stale`, async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(
              shouldStale ? 1 : 0
            );
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        }
      );

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${true}
          ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${true}
          ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${true}
            ${false}      | ${'dummy-issue-milestone'}        | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}               | ${true}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${true}
            ${true}       | ${'dummy-issue-milestone'}        | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${true}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                         | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${true}
            ${false}      | ${'dummy-pull-request-milestone'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${true}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${true}
            ${true}       | ${'dummy-pull-request-milestone'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${true}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${true}
          ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${true}
          ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${true}
            ${false}      | ${'dummy-issue-milestone2'}       | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}               | ${true}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${true}
            ${true}       | ${'dummy-issue-milestone2'}       | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${true}
            ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe.each`
            isPullRequest | milestone                          | name                                                                                         | shouldStale
            ${false}      | ${''}                              | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'}  | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${true}
            ${false}      | ${'dummy-pull-request-milestone2'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${true}
            ${false}      | ${'dummy-milestone2'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                              | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'}  | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${true}
            ${true}       | ${'dummy-pull-request-milestone2'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${true}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });
    });

    describe('when all the issues milestones should exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = true;
      });

      describe.each`
        isPullRequest | milestone            | name                                     | shouldStale
        ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
        ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${false}
        ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
        ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${true}
      `(
        'when $name',
        ({isPullRequest, milestone, shouldStale}: ITestData): void => {
          beforeEach((): void => {
            setTestIssueList(isPullRequest, milestone);
            setProcessor();
          });

          test(`should${
            shouldStale ? '' : ' not'
          } be marked as stale`, async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(
              shouldStale ? 1 : 0
            );
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        }
      );

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${false}
          ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${true}
          ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${false}
            ${false}      | ${'dummy-issue-milestone'}        | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}               | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${true}
            ${true}       | ${'dummy-issue-milestone'}        | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${true}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                         | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${false}
            ${false}      | ${'dummy-pull-request-milestone'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${true}
            ${true}       | ${'dummy-pull-request-milestone'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${true}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${false}
          ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${true}
          ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${false}
            ${false}      | ${'dummy-issue-milestone2'}       | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}               | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${true}
            ${true}       | ${'dummy-issue-milestone2'}       | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${true}
            ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe.each`
            isPullRequest | milestone                          | name                                                                                         | shouldStale
            ${false}      | ${''}                              | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'}  | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${false}
            ${false}      | ${'dummy-pull-request-milestone2'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                              | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'}  | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${true}
            ${true}       | ${'dummy-pull-request-milestone2'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${true}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });
    });

    describe('when all the pull requests milestones are not configured to exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllPrMilestones = undefined;
      });

      describe.each`
        isPullRequest | milestone            | name                                     | shouldStale
        ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
        ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${true}
        ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
        ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${true}
      `(
        'when $name',
        ({isPullRequest, milestone, shouldStale}: ITestData): void => {
          beforeEach((): void => {
            setTestIssueList(isPullRequest, milestone);
            setProcessor();
          });

          test(`should${
            shouldStale ? '' : ' not'
          } be marked as stale`, async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(
              shouldStale ? 1 : 0
            );
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        }
      );

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${true}
          ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${true}
          ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${true}
            ${false}      | ${'dummy-issue-milestone'}        | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}               | ${true}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${true}
            ${true}       | ${'dummy-issue-milestone'}        | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${true}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                         | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${true}
            ${false}      | ${'dummy-pull-request-milestone'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${true}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${true}
            ${true}       | ${'dummy-pull-request-milestone'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${true}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${true}
          ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${true}
          ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${true}
            ${false}      | ${'dummy-issue-milestone2'}       | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}               | ${true}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${true}
            ${true}       | ${'dummy-issue-milestone2'}       | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${true}
            ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe.each`
            isPullRequest | milestone                          | name                                                                                         | shouldStale
            ${false}      | ${''}                              | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'}  | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${true}
            ${false}      | ${'dummy-pull-request-milestone2'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${true}
            ${false}      | ${'dummy-milestone2'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                              | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'}  | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${true}
            ${true}       | ${'dummy-pull-request-milestone2'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${true}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });
    });

    describe('when all the pull requests milestones should not exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllPrMilestones = false;
      });

      describe.each`
        isPullRequest | milestone            | name                                     | shouldStale
        ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
        ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${true}
        ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
        ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${true}
      `(
        'when $name',
        ({isPullRequest, milestone, shouldStale}: ITestData): void => {
          beforeEach((): void => {
            setTestIssueList(isPullRequest, milestone);
            setProcessor();
          });

          test(`should${
            shouldStale ? '' : ' not'
          } be marked as stale`, async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(
              shouldStale ? 1 : 0
            );
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        }
      );

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${true}
          ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${true}
          ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${true}
            ${false}      | ${'dummy-issue-milestone'}        | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}               | ${true}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${true}
            ${true}       | ${'dummy-issue-milestone'}        | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${true}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                         | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${true}
            ${false}      | ${'dummy-pull-request-milestone'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${true}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${true}
            ${true}       | ${'dummy-pull-request-milestone'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${true}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${true}
          ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${true}
          ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${true}
            ${false}      | ${'dummy-issue-milestone2'}       | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}               | ${true}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${true}
            ${true}       | ${'dummy-issue-milestone2'}       | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${true}
            ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe.each`
            isPullRequest | milestone                          | name                                                                                         | shouldStale
            ${false}      | ${''}                              | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'}  | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${true}
            ${false}      | ${'dummy-pull-request-milestone2'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${true}
            ${false}      | ${'dummy-milestone2'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                              | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'}  | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${true}
            ${true}       | ${'dummy-pull-request-milestone2'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${true}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });
    });

    describe('when all the pull requests milestones should exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllPrMilestones = true;
      });

      describe.each`
        isPullRequest | milestone            | name                                     | shouldStale
        ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
        ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${true}
        ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
        ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${false}
      `(
        'when $name',
        ({isPullRequest, milestone, shouldStale}: ITestData): void => {
          beforeEach((): void => {
            setTestIssueList(isPullRequest, milestone);
            setProcessor();
          });

          test(`should${
            shouldStale ? '' : ' not'
          } be marked as stale`, async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(
              shouldStale ? 1 : 0
            );
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        }
      );

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${true}
          ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${false}
          ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${true}
            ${false}      | ${'dummy-issue-milestone'}        | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}               | ${true}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${false}
            ${true}       | ${'dummy-issue-milestone'}        | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                         | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${true}
            ${false}      | ${'dummy-pull-request-milestone'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${true}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${false}
            ${true}       | ${'dummy-pull-request-milestone'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${true}
          ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${false}
          ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${true}
            ${false}      | ${'dummy-issue-milestone2'}       | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}               | ${true}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${false}
            ${true}       | ${'dummy-issue-milestone2'}       | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe.each`
            isPullRequest | milestone                          | name                                                                                         | shouldStale
            ${false}      | ${''}                              | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'}  | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${true}
            ${false}      | ${'dummy-pull-request-milestone2'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${true}
            ${false}      | ${'dummy-milestone2'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                              | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'}  | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${false}
            ${true}       | ${'dummy-pull-request-milestone2'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });
    });
  });

  describe('when all the issues and pull requests milestones should exempt', (): void => {
    beforeEach((): void => {
      opts.exemptAllMilestones = true;
    });

    describe.each`
      isPullRequest | milestone            | name                                     | shouldStale
      ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
      ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${false}
      ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
      ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${false}
    `(
      'when $name',
      ({isPullRequest, milestone, shouldStale}: ITestData): void => {
        beforeEach((): void => {
          setTestIssueList(isPullRequest, milestone);
          setProcessor();
        });

        test(`should${
          shouldStale ? '' : ' not'
        } be marked as stale`, async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(
            shouldStale ? 1 : 0
          );
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      }
    );

    describe('when all the issues milestones are not configured to exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = undefined;
      });

      describe.each`
        isPullRequest | milestone            | name                                     | shouldStale
        ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
        ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${false}
        ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
        ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${false}
      `(
        'when $name',
        ({isPullRequest, milestone, shouldStale}: ITestData): void => {
          beforeEach((): void => {
            setTestIssueList(isPullRequest, milestone);
            setProcessor();
          });

          test(`should${
            shouldStale ? '' : ' not'
          } be marked as stale`, async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(
              shouldStale ? 1 : 0
            );
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        }
      );

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${false}
          ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${false}
          ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${false}
            ${false}      | ${'dummy-issue-milestone'}        | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}               | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${false}
            ${true}       | ${'dummy-issue-milestone'}        | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                         | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${false}
            ${false}      | ${'dummy-pull-request-milestone'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${false}
            ${true}       | ${'dummy-pull-request-milestone'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${false}
          ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${false}
          ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${false}
            ${false}      | ${'dummy-issue-milestone2'}       | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}               | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${false}
            ${true}       | ${'dummy-issue-milestone2'}       | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe.each`
            isPullRequest | milestone                          | name                                                                                         | shouldStale
            ${false}      | ${''}                              | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'}  | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${false}
            ${false}      | ${'dummy-pull-request-milestone2'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                              | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'}  | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${false}
            ${true}       | ${'dummy-pull-request-milestone2'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });
    });

    describe('when all the issues milestones should not exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = false;
      });

      describe.each`
        isPullRequest | milestone            | name                                     | shouldStale
        ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
        ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${true}
        ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
        ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${false}
      `(
        'when $name',
        ({isPullRequest, milestone, shouldStale}: ITestData): void => {
          beforeEach((): void => {
            setTestIssueList(isPullRequest, milestone);
            setProcessor();
          });

          test(`should${
            shouldStale ? '' : ' not'
          } be marked as stale`, async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(
              shouldStale ? 1 : 0
            );
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        }
      );

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${true}
          ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${false}
          ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${true}
            ${false}      | ${'dummy-issue-milestone'}        | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}               | ${true}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${false}
            ${true}       | ${'dummy-issue-milestone'}        | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                         | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${true}
            ${false}      | ${'dummy-pull-request-milestone'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${true}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${false}
            ${true}       | ${'dummy-pull-request-milestone'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${true}
          ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${false}
          ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${true}
            ${false}      | ${'dummy-issue-milestone2'}       | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}               | ${true}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${false}
            ${true}       | ${'dummy-issue-milestone2'}       | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe.each`
            isPullRequest | milestone                          | name                                                                                         | shouldStale
            ${false}      | ${''}                              | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'}  | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${true}
            ${false}      | ${'dummy-pull-request-milestone2'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${true}
            ${false}      | ${'dummy-milestone2'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                              | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'}  | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${false}
            ${true}       | ${'dummy-pull-request-milestone2'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });
    });

    describe('when all the issues milestones should exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = true;
      });

      describe.each`
        isPullRequest | milestone            | name                                     | shouldStale
        ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
        ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${false}
        ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
        ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${false}
      `(
        'when $name',
        ({isPullRequest, milestone, shouldStale}: ITestData): void => {
          beforeEach((): void => {
            setTestIssueList(isPullRequest, milestone);
            setProcessor();
          });

          test(`should${
            shouldStale ? '' : ' not'
          } be marked as stale`, async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(
              shouldStale ? 1 : 0
            );
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        }
      );

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${false}
          ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${false}
          ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${false}
            ${false}      | ${'dummy-issue-milestone'}        | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}               | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${false}
            ${true}       | ${'dummy-issue-milestone'}        | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                         | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${false}
            ${false}      | ${'dummy-pull-request-milestone'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${false}
            ${true}       | ${'dummy-pull-request-milestone'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${false}
          ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${false}
          ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${false}
            ${false}      | ${'dummy-issue-milestone2'}       | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}               | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${false}
            ${true}       | ${'dummy-issue-milestone2'}       | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe.each`
            isPullRequest | milestone                          | name                                                                                         | shouldStale
            ${false}      | ${''}                              | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'}  | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${false}
            ${false}      | ${'dummy-pull-request-milestone2'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                              | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'}  | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${false}
            ${true}       | ${'dummy-pull-request-milestone2'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });
    });

    describe('when all the pull requests milestones are not configured to exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllPrMilestones = undefined;
      });

      describe.each`
        isPullRequest | milestone            | name                                     | shouldStale
        ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
        ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${false}
        ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
        ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${false}
      `(
        'when $name',
        ({isPullRequest, milestone, shouldStale}: ITestData): void => {
          beforeEach((): void => {
            setTestIssueList(isPullRequest, milestone);
            setProcessor();
          });

          test(`should${
            shouldStale ? '' : ' not'
          } be marked as stale`, async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(
              shouldStale ? 1 : 0
            );
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        }
      );

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${false}
          ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${false}
          ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${false}
            ${false}      | ${'dummy-issue-milestone'}        | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}               | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${false}
            ${true}       | ${'dummy-issue-milestone'}        | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                         | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${false}
            ${false}      | ${'dummy-pull-request-milestone'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${false}
            ${true}       | ${'dummy-pull-request-milestone'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${false}
          ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${false}
          ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${false}
            ${false}      | ${'dummy-issue-milestone2'}       | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}               | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${false}
            ${true}       | ${'dummy-issue-milestone2'}       | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe.each`
            isPullRequest | milestone                          | name                                                                                         | shouldStale
            ${false}      | ${''}                              | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'}  | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${false}
            ${false}      | ${'dummy-pull-request-milestone2'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                              | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'}  | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${false}
            ${true}       | ${'dummy-pull-request-milestone2'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });
    });

    describe('when all the pull requests milestones should not exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllPrMilestones = false;
      });

      describe.each`
        isPullRequest | milestone            | name                                     | shouldStale
        ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
        ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${false}
        ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
        ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${true}
      `(
        'when $name',
        ({isPullRequest, milestone, shouldStale}: ITestData): void => {
          beforeEach((): void => {
            setTestIssueList(isPullRequest, milestone);
            setProcessor();
          });

          test(`should${
            shouldStale ? '' : ' not'
          } be marked as stale`, async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(
              shouldStale ? 1 : 0
            );
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        }
      );

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${false}
          ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${true}
          ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${false}
            ${false}      | ${'dummy-issue-milestone'}        | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}               | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${true}
            ${true}       | ${'dummy-issue-milestone'}        | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${true}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                         | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${false}
            ${false}      | ${'dummy-pull-request-milestone'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${true}
            ${true}       | ${'dummy-pull-request-milestone'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${true}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${false}
          ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${true}
          ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${false}
            ${false}      | ${'dummy-issue-milestone2'}       | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}               | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${true}
            ${true}       | ${'dummy-issue-milestone2'}       | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${true}
            ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe.each`
            isPullRequest | milestone                          | name                                                                                         | shouldStale
            ${false}      | ${''}                              | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'}  | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${false}
            ${false}      | ${'dummy-pull-request-milestone2'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                              | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'}  | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${true}
            ${true}       | ${'dummy-pull-request-milestone2'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${true}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });
    });

    describe('when all the pull requests milestones should exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllPrMilestones = true;
      });

      describe.each`
        isPullRequest | milestone            | name                                     | shouldStale
        ${false}      | ${''}                | ${'the issue does not have a milestone'} | ${true}
        ${false}      | ${'dummy-milestone'} | ${'the issue does have a milestone'}     | ${false}
        ${true}       | ${''}                | ${'the PR does not have a milestone'}    | ${true}
        ${true}       | ${'dummy-milestone'} | ${'the PR does have a milestone'}        | ${false}
      `(
        'when $name',
        ({isPullRequest, milestone, shouldStale}: ITestData): void => {
          beforeEach((): void => {
            setTestIssueList(isPullRequest, milestone);
            setProcessor();
          });

          test(`should${
            shouldStale ? '' : ' not'
          } be marked as stale`, async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(
              shouldStale ? 1 : 0
            );
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        }
      );

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${false}
          ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${false}
          ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${false}
            ${false}      | ${'dummy-issue-milestone'}        | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}               | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${false}
            ${true}       | ${'dummy-issue-milestone'}        | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                         | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${false}
            ${false}      | ${'dummy-pull-request-milestone'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${false}
            ${true}       | ${'dummy-pull-request-milestone'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe.each`
          isPullRequest | milestone                         | name                                                                            | shouldStale
          ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                        | ${true}
          ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific exempted one'} | ${false}
          ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}         | ${false}
          ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                           | ${true}
          ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific exempted one'}    | ${false}
          ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}            | ${false}
        `(
          'when $name',
          ({isPullRequest, milestone, shouldStale}: ITestData): void => {
            beforeEach((): void => {
              setTestIssueList(isPullRequest, milestone);
              setProcessor();
            });

            test(`should${
              shouldStale ? '' : ' not'
            } be marked as stale`, async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(
                shouldStale ? 1 : 0
              );
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          }
        );

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe.each`
            isPullRequest | milestone                         | name                                                                                  | shouldStale
            ${false}      | ${''}                             | ${'the issue does not have a milestone'}                                              | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'} | ${'the issue does have a milestone but not matching the specific issue exempted one'} | ${false}
            ${false}      | ${'dummy-issue-milestone2'}       | ${'the issue does have a milestone matching the specific issue exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}             | ${'the issue does have a milestone matching the specific exempted one'}               | ${false}
            ${true}       | ${''}                             | ${'the PR does not have a milestone'}                                                 | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'} | ${'the PR does have a milestone but not matching the specific issue exempted one'}    | ${false}
            ${true}       | ${'dummy-issue-milestone2'}       | ${'the PR does have a milestone matching the specific issue exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}             | ${'the PR does have a milestone matching the specific exempted one'}                  | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe.each`
            isPullRequest | milestone                          | name                                                                                         | shouldStale
            ${false}      | ${''}                              | ${'the issue does not have a milestone'}                                                     | ${true}
            ${false}      | ${'dummy-milestone-not-exempted'}  | ${'the issue does have a milestone but not matching the specific pull request exempted one'} | ${false}
            ${false}      | ${'dummy-pull-request-milestone2'} | ${'the issue does have a milestone matching the specific pull request exempted one'}         | ${false}
            ${false}      | ${'dummy-milestone2'}              | ${'the issue does have a milestone matching the specific exempted one'}                      | ${false}
            ${true}       | ${''}                              | ${'the PR does not have a milestone'}                                                        | ${true}
            ${true}       | ${'dummy-milestone-not-exempted'}  | ${'the PR does have a milestone but not matching the specific pull request exempted one'}    | ${false}
            ${true}       | ${'dummy-pull-request-milestone2'} | ${'the PR does have a milestone matching the specific pull request exempted one'}            | ${false}
            ${true}       | ${'dummy-milestone2'}              | ${'the PR does have a milestone matching the specific exempted one'}                         | ${false}
          `(
            'when $name',
            ({isPullRequest, milestone, shouldStale}: ITestData): void => {
              beforeEach((): void => {
                setTestIssueList(isPullRequest, milestone);
                setProcessor();
              });

              test(`should${
                shouldStale ? '' : ' not'
              } be marked as stale`, async () => {
                expect.assertions(3);

                await processor.processIssues(1);

                expect(processor.staleIssues.length).toStrictEqual(
                  shouldStale ? 1 : 0
                );
                expect(processor.closedIssues.length).toStrictEqual(0);
                expect(processor.removedLabelIssues.length).toStrictEqual(0);
              });
            }
          );
        });
      });
    });
  });
});
