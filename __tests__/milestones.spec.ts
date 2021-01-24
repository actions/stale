import {Issue} from '../src/classes/issue';
import {IssuesProcessor} from '../src/classes/issues-processor';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';

describe('milestones options', (): void => {
  let opts: IIssuesProcessorOptions;
  let testIssueList: Issue[];
  let processor: IssuesProcessor;

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
    processor = new IssuesProcessor(
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

    describe('when the issue does not have a milestone', (): void => {
      beforeEach((): void => {
        setTestIssueList(false, '');
        setProcessor();
      });

      test('should be marked as stale', async () => {
        expect.assertions(3);

        await processor.processIssues(1);

        expect(processor.staleIssues.length).toStrictEqual(1);
        expect(processor.closedIssues.length).toStrictEqual(0);
        expect(processor.removedLabelIssues.length).toStrictEqual(0);
      });
    });

    describe('when the issue does have a milestone', (): void => {
      beforeEach((): void => {
        setTestIssueList(false, 'dummy-milestone');
        setProcessor();
      });

      test('should be marked as stale', async () => {
        expect.assertions(3);

        await processor.processIssues(1);

        expect(processor.staleIssues.length).toStrictEqual(1);
        expect(processor.closedIssues.length).toStrictEqual(0);
        expect(processor.removedLabelIssues.length).toStrictEqual(0);
      });
    });

    describe('when the PR does not have a milestone', (): void => {
      beforeEach((): void => {
        setTestIssueList(true, '');
        setProcessor();
      });

      test('should be marked as stale', async () => {
        expect.assertions(3);

        await processor.processIssues(1);

        expect(processor.staleIssues.length).toStrictEqual(1);
        expect(processor.closedIssues.length).toStrictEqual(0);
        expect(processor.removedLabelIssues.length).toStrictEqual(0);
      });
    });

    describe('when the PR does have a milestone', (): void => {
      beforeEach((): void => {
        setTestIssueList(true, 'dummy-milestone');
        setProcessor();
      });

      test('should be marked as stale', async () => {
        expect.assertions(3);

        await processor.processIssues(1);

        expect(processor.staleIssues.length).toStrictEqual(1);
        expect(processor.closedIssues.length).toStrictEqual(0);
        expect(processor.removedLabelIssues.length).toStrictEqual(0);
      });
    });

    describe('when all the issues milestones is not configured to exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = undefined;
      });

      describe('when the issue does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the issue does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, 'dummy-milestone');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, 'dummy-milestone');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe('when the issue does not have a milestone', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, '');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the issue does have a milestone but not matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, 'dummy-milestone-not-exempted');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the issue does have a milestone matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, 'dummy-milestone');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does not have a milestone', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, '');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does have a milestone but not matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, 'dummy-milestone-not-exempted');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does have a milestone matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, 'dummy-milestone');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe('when the issue does not have a milestone', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, '');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone but not matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-issue-milestone');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does not have a milestone', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  ''
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone but not matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-issue-milestone');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe('when the issue does not have a milestone', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, '');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone but not matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  false,
                  undefined,
                  undefined,
                  undefined,
                  'dummy-pull-request-milestone'
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does not have a milestone', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  ''
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone but not matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  'dummy-pull-request-milestone'
                )
              ];
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe('when the issue does not have a milestone', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, '');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the issue does have a milestone but not matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, 'dummy-milestone-not-exempted');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the issue does have a milestone matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, 'dummy-milestone2');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does not have a milestone', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, '');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does have a milestone but not matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, 'dummy-milestone-not-exempted');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does have a milestone matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, 'dummy-milestone2');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe('when the issue does not have a milestone', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, '');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone but not matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-issue-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone2');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does not have a milestone', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  ''
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone but not matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-issue-milestone2');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe('when the issue does not have a milestone', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, '');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone but not matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-pull-request-milestone2');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does not have a milestone', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  ''
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone but not matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-pull-request-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone2');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });
        });
      });
    });

    describe('when all the issues milestones should not exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = false;
      });

      describe('when the issue does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the issue does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, 'dummy-milestone');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, 'dummy-milestone');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe('when the issue does not have a milestone', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, '');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the issue does have a milestone but not matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, 'dummy-milestone-not-exempted');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the issue does have a milestone matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, 'dummy-milestone');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does not have a milestone', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, '');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does have a milestone but not matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, 'dummy-milestone-not-exempted');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does have a milestone matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, 'dummy-milestone');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe('when the issue does not have a milestone', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, '');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone but not matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-issue-milestone');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does not have a milestone', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  ''
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone but not matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-issue-milestone');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe('when the issue does not have a milestone', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, '');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone but not matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  false,
                  undefined,
                  undefined,
                  undefined,
                  'dummy-pull-request-milestone'
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does not have a milestone', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  ''
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone but not matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  'dummy-pull-request-milestone'
                )
              ];
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe('when the issue does not have a milestone', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, '');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the issue does have a milestone but not matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, 'dummy-milestone-not-exempted');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the issue does have a milestone matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, 'dummy-milestone2');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does not have a milestone', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, '');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does have a milestone but not matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, 'dummy-milestone-not-exempted');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does have a milestone matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, 'dummy-milestone2');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe('when the issue does not have a milestone', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, '');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone but not matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-issue-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone2');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does not have a milestone', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  ''
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone but not matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-issue-milestone2');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe('when the issue does not have a milestone', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, '');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone but not matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-pull-request-milestone2');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does not have a milestone', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  ''
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone but not matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-pull-request-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone2');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });
        });
      });
    });

    describe('when all the issues milestones should exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = true;
      });

      describe('when the issue does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the issue does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, 'dummy-milestone');
          setProcessor();
        });

        test('should not be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(0);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, 'dummy-milestone');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when all the issues and pull requests milestones should exempt a specific milestone', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone';
        });

        describe('when the issue does not have a milestone', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, '');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the issue does have a milestone but not matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, 'dummy-milestone-not-exempted');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the issue does have a milestone matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, 'dummy-milestone');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does not have a milestone', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, '');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does have a milestone but not matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, 'dummy-milestone-not-exempted');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does have a milestone matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, 'dummy-milestone');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones = 'dummy-issue-milestone';
          });

          describe('when the issue does not have a milestone', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, '');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone but not matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-issue-milestone');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does not have a milestone', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  ''
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone but not matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-issue-milestone');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones = 'dummy-pull-request-milestone';
          });

          describe('when the issue does not have a milestone', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, '');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone but not matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  false,
                  undefined,
                  undefined,
                  undefined,
                  'dummy-pull-request-milestone'
                )
              ];
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does not have a milestone', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  ''
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone but not matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  'dummy-pull-request-milestone'
                )
              ];
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });
        });
      });

      describe('when all the issues and pull requests milestones should exempt some milestones', (): void => {
        beforeEach((): void => {
          opts.exemptMilestones = 'dummy-milestone1, dummy-milestone2';
        });

        describe('when the issue does not have a milestone', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, '');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the issue does have a milestone but not matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, 'dummy-milestone-not-exempted');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the issue does have a milestone matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(false, 'dummy-milestone2');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does not have a milestone', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, '');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does have a milestone but not matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, 'dummy-milestone-not-exempted');
            setProcessor();
          });

          test('should be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(1);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when the PR does have a milestone matching the specific exempted one', (): void => {
          beforeEach((): void => {
            setTestIssueList(true, 'dummy-milestone2');
            setProcessor();
          });

          test('should not be marked as stale', async () => {
            expect.assertions(3);

            await processor.processIssues(1);

            expect(processor.staleIssues.length).toStrictEqual(0);
            expect(processor.closedIssues.length).toStrictEqual(0);
            expect(processor.removedLabelIssues.length).toStrictEqual(0);
          });
        });

        describe('when all the issues milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptIssueMilestones =
              'dummy-issue-milestone1, dummy-issue-milestone2';
          });

          describe('when the issue does not have a milestone', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, '');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone but not matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-issue-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does not have a milestone', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  ''
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone but not matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific issue exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-issue-milestone2');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });
        });

        describe('when all the pull requests milestones should exempt a specific milestone', (): void => {
          beforeEach((): void => {
            opts.exemptPrMilestones =
              'dummy-pull-request-milestone1, dummy-pull-request-milestone2';
          });

          describe('when the issue does not have a milestone', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, '');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone but not matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-pull-request-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the issue does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(false, 'dummy-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does not have a milestone', (): void => {
            beforeEach((): void => {
              testIssueList = [
                generateIssue(
                  opts,
                  1,
                  'My first issue',
                  '2020-01-01T17:00:00Z',
                  '2020-01-01T17:00:00Z',
                  true,
                  undefined,
                  undefined,
                  undefined,
                  ''
                )
              ];
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone but not matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone-not-exempted');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific pull request exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-pull-request-milestone2');
              setProcessor();
            });

            test('should not be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(0);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });

          describe('when the PR does have a milestone matching the specific exempted one', (): void => {
            beforeEach((): void => {
              setTestIssueList(true, 'dummy-milestone2');
              setProcessor();
            });

            test('should be marked as stale', async () => {
              expect.assertions(3);

              await processor.processIssues(1);

              expect(processor.staleIssues.length).toStrictEqual(1);
              expect(processor.closedIssues.length).toStrictEqual(0);
              expect(processor.removedLabelIssues.length).toStrictEqual(0);
            });
          });
        });
      });
    });

    describe('when all the pull requests milestones is not configured to exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllPrMilestones = undefined;
      });

      describe('when the issue does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the issue does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, 'dummy-milestone');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, 'dummy-milestone');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });
    });

    describe('when all the pull requests milestones should not exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllPrMilestones = false;
      });

      describe('when the issue does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the issue does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, 'dummy-milestone');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, 'dummy-milestone');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });
    });

    describe('when all the pull requests milestones should exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllPrMilestones = true;
      });

      describe('when the issue does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the issue does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, 'dummy-milestone');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, 'dummy-milestone');
          setProcessor();
        });

        test('should not be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(0);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });
    });
  });

  describe('when all the issues and pull requests milestones should exempt', (): void => {
    beforeEach((): void => {
      opts.exemptAllMilestones = true;
    });

    describe('when the issue does not have a milestone', (): void => {
      beforeEach((): void => {
        setTestIssueList(false, '');
        setProcessor();
      });

      test('should be marked as stale', async () => {
        expect.assertions(3);

        await processor.processIssues(1);

        expect(processor.staleIssues.length).toStrictEqual(1);
        expect(processor.closedIssues.length).toStrictEqual(0);
        expect(processor.removedLabelIssues.length).toStrictEqual(0);
      });
    });

    describe('when the issue does have a milestone', (): void => {
      beforeEach((): void => {
        testIssueList = [
          generateIssue(
            opts,
            1,
            'My first issue',
            '2020-01-01T17:00:00Z',
            '2020-01-01T17:00:00Z',
            false,
            undefined,
            undefined,
            undefined,
            'dummy-milestone'
          )
        ];
        setProcessor();
      });

      test('should not be marked as stale', async () => {
        expect.assertions(3);

        await processor.processIssues(1);

        expect(processor.staleIssues.length).toStrictEqual(0);
        expect(processor.closedIssues.length).toStrictEqual(0);
        expect(processor.removedLabelIssues.length).toStrictEqual(0);
      });
    });

    describe('when the PR does not have a milestone', (): void => {
      beforeEach((): void => {
        setTestIssueList(true, '');
        setProcessor();
      });

      test('should be marked as stale', async () => {
        expect.assertions(3);

        await processor.processIssues(1);

        expect(processor.staleIssues.length).toStrictEqual(1);
        expect(processor.closedIssues.length).toStrictEqual(0);
        expect(processor.removedLabelIssues.length).toStrictEqual(0);
      });
    });

    describe('when the PR does have a milestone', (): void => {
      beforeEach((): void => {
        setTestIssueList(true, 'dummy-milestone');
        setProcessor();
      });

      test('should not be marked as stale', async () => {
        expect.assertions(3);

        await processor.processIssues(1);

        expect(processor.staleIssues.length).toStrictEqual(0);
        expect(processor.closedIssues.length).toStrictEqual(0);
        expect(processor.removedLabelIssues.length).toStrictEqual(0);
      });
    });

    describe('when all the issues milestones is not configured to exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = undefined;
      });

      describe('when the issue does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the issue does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, 'dummy-milestone');
          setProcessor();
        });

        test('should not be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(0);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, 'dummy-milestone');
          setProcessor();
        });

        test('should not be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(0);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });
    });

    describe('when all the issues milestones should not exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = false;
      });

      describe('when the issue does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the issue does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, 'dummy-milestone');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, 'dummy-milestone');
          setProcessor();
        });

        test('should not be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(0);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });
    });

    describe('when all the issues milestones should exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = true;
      });

      describe('when the issue does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the issue does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, 'dummy-milestone');
          setProcessor();
        });

        test('should not be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(0);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, 'dummy-milestone');
          setProcessor();
        });

        test('should not be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(0);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });
    });

    describe('when all the pull requests milestones is not configured to exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllPrMilestones = undefined;
      });

      describe('when the issue does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the issue does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, 'dummy-milestone');
          setProcessor();
        });

        test('should not be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(0);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, 'dummy-milestone');
          setProcessor();
        });

        test('should not be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(0);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });
    });

    describe('when all the pull requests milestones should not exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllPrMilestones = false;
      });

      describe('when the issue does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the issue does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, 'dummy-milestone');
          setProcessor();
        });

        test('should not be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(0);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, 'dummy-milestone');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });
    });

    describe('when all the pull requests milestones should exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllPrMilestones = true;
      });

      describe('when the issue does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the issue does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(false, 'dummy-milestone');
          setProcessor();
        });

        test('should not be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(0);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does not have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, '');
          setProcessor();
        });

        test('should be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(1);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });

      describe('when the PR does have a milestone', (): void => {
        beforeEach((): void => {
          setTestIssueList(true, 'dummy-milestone');
          setProcessor();
        });

        test('should not be marked as stale', async () => {
          expect.assertions(3);

          await processor.processIssues(1);

          expect(processor.staleIssues.length).toStrictEqual(0);
          expect(processor.closedIssues.length).toStrictEqual(0);
          expect(processor.removedLabelIssues.length).toStrictEqual(0);
        });
      });
    });
  });
});
