import {Issue} from '../src/classes/issue';
import {IssuesProcessor} from '../src/classes/issues-processor';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';

test('a PR without a milestone will be marked as stale', async () => {
  expect.assertions(3);
  const testIssueList: Issue[] = [
    generateIssue(
      DefaultProcessorOptions,
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
  const processor = new IssuesProcessor(
    DefaultProcessorOptions,
    async () => 'abot',
    async p => (p === 1 ? testIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR without an exempted milestone will be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  const testIssueList: Issue[] = [
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
      'Milestone'
    )
  ];
  const processor = new IssuesProcessor(
    opts,
    async () => 'abot',
    async p => (p === 1 ? testIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR with an exempted milestone will not be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  const testIssueList: Issue[] = [
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
      'Milestone1'
    )
  ];
  const processor = new IssuesProcessor(
    opts,
    async () => 'abot',
    async p => (p === 1 ? testIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR with an exempted milestone will not be marked as stale (multi milestones with spaces)', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1, Milestone2';
  const testIssueList: Issue[] = [
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
      'Milestone2'
    )
  ];
  const processor = new IssuesProcessor(
    opts,
    async () => 'abot',
    async p => (p === 1 ? testIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR with an exempted milestone will not be marked as stale (multi milestones without spaces)', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1,Milestone2';
  const testIssueList: Issue[] = [
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
      'Milestone2'
    )
  ];
  const processor = new IssuesProcessor(
    opts,
    async () => 'abot',
    async p => (p === 1 ? testIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR with an exempted milestone but without an exempted issue milestone will not be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  opts.exemptPrMilestones = '';
  const testIssueList: Issue[] = [
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
      'Milestone1'
    )
  ];
  const processor = new IssuesProcessor(
    opts,
    async () => 'abot',
    async p => (p === 1 ? testIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR with an exempted milestone but with another exempted issue milestone will be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  opts.exemptPrMilestones = 'Milestone2';
  const testIssueList: Issue[] = [
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
      'Milestone1'
    )
  ];
  const processor = new IssuesProcessor(
    opts,
    async () => 'abot',
    async p => (p === 1 ? testIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR with an exempted milestone and with an exempted issue milestone will not be marked as stale', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptMilestones = 'Milestone1';
  opts.exemptPrMilestones = 'Milestone1';
  const testIssueList: Issue[] = [
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
      'Milestone1'
    )
  ];
  const processor = new IssuesProcessor(
    opts,
    async () => 'abot',
    async p => (p === 1 ? testIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(0);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

test('a PR without a milestone will be marked as stale when all milestones should not exempt', async () => {
  expect.assertions(3);
  const opts = {...DefaultProcessorOptions};
  opts.exemptAllMilestones = false;
  const testIssueList: Issue[] = [
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
  const processor = new IssuesProcessor(
    opts,
    async () => 'abot',
    async p => (p === 1 ? testIssueList : []),
    async () => [],
    async () => new Date().toDateString()
  );

  // process our fake issue list
  await processor.processIssues(1);

  expect(processor.staleIssues.length).toStrictEqual(1);
  expect(processor.closedIssues.length).toStrictEqual(0);
  expect(processor.removedLabelIssues.length).toStrictEqual(0);
});

describe('milestones options', (): void => {
  let opts: IIssuesProcessorOptions;
  let testIssueList: Issue[];
  let processor: IssuesProcessor;

  beforeEach((): void => {
    opts = {...DefaultProcessorOptions};
  });

  describe('when all the issues and pull requests milestones should not exempt', (): void => {
    beforeEach((): void => {
      opts.exemptAllMilestones = false;
    });

    describe('when the issue does not have a milestone', (): void => {
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
            ''
          )
        ];
        processor = new IssuesProcessor(
          opts,
          async () => 'abot',
          async p => (p === 1 ? testIssueList : []),
          async () => [],
          async () => new Date().toDateString()
        );
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
        processor = new IssuesProcessor(
          opts,
          async () => 'abot',
          async p => (p === 1 ? testIssueList : []),
          async () => [],
          async () => new Date().toDateString()
        );
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
        processor = new IssuesProcessor(
          opts,
          async () => 'abot',
          async p => (p === 1 ? testIssueList : []),
          async () => [],
          async () => new Date().toDateString()
        );
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
            'dummy-milestone'
          )
        ];
        processor = new IssuesProcessor(
          opts,
          async () => 'abot',
          async p => (p === 1 ? testIssueList : []),
          async () => [],
          async () => new Date().toDateString()
        );
      });

      test('should be marked as stale', async () => {
        expect.assertions(3);

        await processor.processIssues(1);

        expect(processor.staleIssues.length).toStrictEqual(1);
        expect(processor.closedIssues.length).toStrictEqual(0);
        expect(processor.removedLabelIssues.length).toStrictEqual(0);
      });
    });

    describe('when all the issues milestones should not exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = false;
      });

      describe('when the issue does not have a milestone', (): void => {
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
              ''
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
              'dummy-milestone'
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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

    describe('when all the issues milestones should exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = true;
      });

      describe('when the issue does not have a milestone', (): void => {
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
              ''
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
              'dummy-milestone'
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
              ''
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
              'dummy-milestone'
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
              ''
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
              'dummy-milestone'
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
            ''
          )
        ];
        processor = new IssuesProcessor(
          opts,
          async () => 'abot',
          async p => (p === 1 ? testIssueList : []),
          async () => [],
          async () => new Date().toDateString()
        );
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
        processor = new IssuesProcessor(
          opts,
          async () => 'abot',
          async p => (p === 1 ? testIssueList : []),
          async () => [],
          async () => new Date().toDateString()
        );
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
        processor = new IssuesProcessor(
          opts,
          async () => 'abot',
          async p => (p === 1 ? testIssueList : []),
          async () => [],
          async () => new Date().toDateString()
        );
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
            'dummy-milestone'
          )
        ];
        processor = new IssuesProcessor(
          opts,
          async () => 'abot',
          async p => (p === 1 ? testIssueList : []),
          async () => [],
          async () => new Date().toDateString()
        );
      });

      test('should not be marked as stale', async () => {
        expect.assertions(3);

        await processor.processIssues(1);

        expect(processor.staleIssues.length).toStrictEqual(0);
        expect(processor.closedIssues.length).toStrictEqual(0);
        expect(processor.removedLabelIssues.length).toStrictEqual(0);
      });
    });

    describe('when all the issues milestones should not exempt', (): void => {
      beforeEach((): void => {
        opts.exemptAllIssueMilestones = false;
      });

      describe('when the issue does not have a milestone', (): void => {
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
              ''
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
              'dummy-milestone'
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
              ''
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
              'dummy-milestone'
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
              ''
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
              'dummy-milestone'
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
              ''
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
              'dummy-milestone'
            )
          ];
          processor = new IssuesProcessor(
            opts,
            async () => 'abot',
            async p => (p === 1 ? testIssueList : []),
            async () => [],
            async () => new Date().toDateString()
          );
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
