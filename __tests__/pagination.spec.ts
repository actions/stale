import {describe, expect, it} from '@jest/globals';
import {Issue} from '../src/classes/issue.js';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options.js';
import {IssuesProcessorMock} from './classes/issues-processor-mock.js';
import {alwaysFalseStateMock, StateMock} from './classes/state-mock.js';
import {DefaultProcessorOptions} from './constants/default-processor-options.js';
import {generateIssue} from './functions/generate-issue.js';

describe('pagination', (): void => {
  it('processes every initially open pull request when earlier pages close items', async (): Promise<void> => {
    const pageSize = 10;
    const options: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      closePrMessage: '',
      daysBeforePrClose: 0,
      operationsPerRun: 100
    };
    const initiallyOpenPullRequests: Issue[] = Array.from(
      {length: 25},
      (_, index): Issue =>
        generateIssue(
          options,
          index + 1,
          `Pull request #${index + 1}`,
          '2020-01-01T17:00:00Z',
          '2020-01-01T17:00:00Z',
          false,
          true,
          [options.stalePrLabel]
        )
    );

    const processorReference: {current?: IssuesProcessorMock} = {};
    const processor = new IssuesProcessorMock(
      options,
      alwaysFalseStateMock,
      async page => {
        const closedNumbers = new Set(
          processorReference.current?.closedIssues.map(issue => issue.number) ??
            []
        );
        const currentlyOpenPullRequests = initiallyOpenPullRequests.filter(
          issue => !closedNumbers.has(issue.number)
        );
        const pageStart = (page - 1) * pageSize;

        return currentlyOpenPullRequests.slice(pageStart, pageStart + pageSize);
      },
      async () => [],
      async () => '2020-01-01T17:00:00Z'
    );
    processorReference.current = processor;

    await processor.processIssues();

    expect(processor.closedIssues.map(issue => issue.number)).toEqual(
      initiallyOpenPullRequests.map(issue => issue.number)
    );
  });

  it('inspects every item when only some items in an earlier page close', async (): Promise<void> => {
    const pageSize = 10;
    const options: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      operationsPerRun: 100
    };
    const initiallyOpenPullRequests = Array.from(
      {length: 25},
      (_, index): Issue =>
        generateIssue(
          options,
          index + 1,
          `Pull request #${index + 1}`,
          '2020-01-01T17:00:00Z',
          '2020-01-01T17:00:00Z',
          false,
          true
        )
    );
    const inspectedNumbers: number[] = [];
    const requestedPages: number[] = [];
    const processedNumbers = new Set<number>();
    const state = new StateMock();
    state.addIssueToProcessed = issue => {
      processedNumbers.add(issue.number);
    };
    state.isIssueProcessed = issue => processedNumbers.has(issue.number);
    const processorReference: {current?: IssuesProcessorMock} = {};
    const processor = new IssuesProcessorMock(options, state, async page => {
      requestedPages.push(page);
      const closedNumbers = new Set(
        processorReference.current?.closedIssues.map(issue => issue.number) ??
          []
      );
      const currentlyOpenPullRequests = initiallyOpenPullRequests.filter(
        issue => !closedNumbers.has(issue.number)
      );
      const pageStart = (page - 1) * pageSize;

      return currentlyOpenPullRequests.slice(pageStart, pageStart + pageSize);
    });
    processorReference.current = processor;
    processor.processIssue = async issue => {
      inspectedNumbers.push(issue.number);
      if (issue.number <= 5) {
        processor.closedIssues.push(issue);
      }
    };

    await processor.processIssues();

    expect(inspectedNumbers).toEqual(
      initiallyOpenPullRequests.map(issue => issue.number)
    );
    expect(requestedPages).toEqual([1, 1, 2, 3]);
  });

  it('retries stale pages until closures are reflected without processing items twice', async (): Promise<void> => {
    const options: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      debugOnly: false,
      operationsPerRun: 100
    };
    const pullRequests = Array.from({length: 14}, (_, index): Issue =>
      generateIssue(
        options,
        index + 1,
        `Pull request #${index + 1}`,
        '2020-01-01T17:00:00Z',
        '2020-01-01T17:00:00Z',
        false,
        true
      )
    );
    const requestedPages: number[] = [];
    const inspectedNumbers: number[] = [];
    const processedNumbers = new Set<number>();
    const state = new StateMock();
    state.addIssueToProcessed = issue => {
      processedNumbers.add(issue.number);
    };
    state.isIssueProcessed = issue => processedNumbers.has(issue.number);
    let pageOneRequests = 0;
    const processor = new IssuesProcessorMock(options, state, async page => {
      requestedPages.push(page);

      if (page !== 1) {
        return [];
      }

      pageOneRequests += 1;
      if (pageOneRequests === 1) {
        return pullRequests.slice(0, 10);
      }
      if (pageOneRequests <= 5) {
        return pullRequests.slice(2, 12);
      }

      return pullRequests.slice(4, 14);
    });
    processor.processIssue = async issue => {
      inspectedNumbers.push(issue.number);
      if (issue.number <= 4) {
        processor.closedIssues.push(issue);
      }
    };
    const waitCalls: number[] = [];
    processor.wait = async (milliseconds: number) => {
      waitCalls.push(milliseconds);
    };

    await processor.processIssues();

    expect(inspectedNumbers).toEqual(pullRequests.map(issue => issue.number));
    expect(requestedPages).toEqual([1, 1, 1, 1, 1, 1, 2]);
    // The first re-check happens immediately after the closures.
    // Backoff starts once a fresh fetch confirms the same closed items
    // are still visible, then increases on each further retry.
    expect(waitCalls).toEqual([500, 1000, 2000, 4000]);
  });

  it('stops retrying a stale page when operationsPerRun is exhausted', async () => {
    const options: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      debugOnly: false,
      operationsPerRun: 3
    };

    // already processed/closed in a previous pass, but the fixture keeps
    // returning it forever to simulate GitHub never reflecting the closure
    const closedIssue = generateIssue(
      options,
      1,
      'Closed issue',
      '2020-01-01T17:00:00Z',
      '2020-01-01T17:00:00Z',
      false,
      true
    );
    const state = new StateMock();
    state.isIssueProcessed = issue => issue.number === 1;

    const requestedPages: number[] = [];
    const processor = new IssuesProcessorMock(options, state, async page => {
      requestedPages.push(page);
      // mirrors getIssues() consuming 1 operation per fetch in production, including retries
      processor.operations.consumeOperation();
      return page === 1 ? [closedIssue] : [];
    });

    // Simulate an item closed earlier in this run but still returned by GitHub.
    processor.closedIssues.push(closedIssue);

    const waitCalls: number[] = [];
    processor.wait = async milliseconds => {
      waitCalls.push(milliseconds);
    };

    const result = await processor.processIssues();

    expect(result).toBe(0);
    expect(requestedPages).toEqual([1, 1, 1]);
    expect(waitCalls).toEqual([500, 1000]);
  });

  it('processes every pull request when regular issues share the paginated result', async (): Promise<void> => {
    const pageSize = 10;
    const options: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      closePrMessage: '',
      daysBeforePrClose: 0,
      daysBeforeIssueStale: -1,
      daysBeforeIssueClose: -1,
      operationsPerRun: 100
    };
    const pullRequests = Array.from({length: 25}, (_, index): Issue =>
      generateIssue(
        options,
        index + 1,
        `Pull request #${index + 1}`,
        '2020-01-01T17:00:00Z',
        '2020-01-01T17:00:00Z',
        false,
        true,
        [options.stalePrLabel]
      )
    );
    const regularIssues = Array.from({length: 7}, (_, index): Issue =>
      generateIssue(
        options,
        100 + index,
        `Issue #${100 + index}`,
        '2020-01-01T17:00:00Z'
      )
    );
    const initiallyOpenItems = [
      ...pullRequests.slice(0, 18),
      ...regularIssues,
      ...pullRequests.slice(18)
    ];
    const processorReference: {current?: IssuesProcessorMock} = {};
    const processor = new IssuesProcessorMock(
      options,
      alwaysFalseStateMock,
      async page => {
        const closedNumbers = new Set(
          processorReference.current?.closedIssues.map(issue => issue.number) ??
            []
        );
        const currentlyOpenItems = initiallyOpenItems.filter(
          issue => !closedNumbers.has(issue.number)
        );
        const pageStart = (page - 1) * pageSize;

        return currentlyOpenItems.slice(pageStart, pageStart + pageSize);
      },
      async () => [],
      async () => '2020-01-01T17:00:00Z'
    );
    processorReference.current = processor;

    await processor.processIssues();

    expect(processor.closedIssues.map(issue => issue.number)).toEqual(
      pullRequests.map(issue => issue.number)
    );
  });

  it('processes items shifted into an earlier page by comment-based reordering', async (): Promise<void> => {
    const pageSize = 5;

    const options: IIssuesProcessorOptions = {
      ...DefaultProcessorOptions,
      sortBy: 'comments',
      ascending: true,
      debugOnly: false,
      operationsPerRun: 100
    };

    const allIssues: Issue[] = Array.from({length: 10}, (_, index): Issue =>
      generateIssue(
        options,
        index + 1,
        `Pull request #${index + 1}`,
        '2020-01-01T17:00:00Z',
        '2020-01-01T17:00:00Z',
        false,
        true
      )
    );

    // Initial ordering:
    // Page 1 -> #1(0) #2(0) #3(0) #4(1) #5(1)
    // Page 2 -> #6(1) #7(2) #8(3) #9(4) #10(5)
    const commentCounts = new Map<number, number>([
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 1],
      [5, 1],
      [6, 1],
      [7, 2],
      [8, 3],
      [9, 4],
      [10, 5]
    ]);

    const inspectedNumbers: number[] = [];
    const requestedPages: number[] = [];

    const state = new StateMock();
    const processedNumbers = new Set<number>();

    state.addIssueToProcessed = issue => {
      processedNumbers.add(issue.number);
    };

    state.isIssueProcessed = issue => processedNumbers.has(issue.number);

    const processor = new IssuesProcessorMock(options, state, async page => {
      requestedPages.push(page);

      const sorted = [...allIssues].sort((a, b) => {
        const diff =
          (commentCounts.get(a.number) ?? 0) -
          (commentCounts.get(b.number) ?? 0);

        return diff !== 0 ? diff : a.number - b.number;
      });

      const pageStart = (page - 1) * pageSize;

      return sorted.slice(pageStart, pageStart + pageSize);
    });

    processor.processIssue = async issue => {
      inspectedNumbers.push(issue.number);

      // Simulate marking #4 and #5 stale by adding a comment.
      if (issue.number === 4 || issue.number === 5) {
        commentCounts.set(
          issue.number,
          (commentCounts.get(issue.number) ?? 0) + 1
        );
      }
    };

    await processor.processIssues();

    // After processing Page 1:
    // Page 1 -> #1(0) #2(0) #3(0) #6(1) #7(2)
    //                         ↑       ↑
    //                     moved from Page 2

    expect(inspectedNumbers.slice().sort((a, b) => a - b)).toEqual(
      allIssues.map(issue => issue.number)
    );

    expect(requestedPages).toContain(1);
    expect(requestedPages).toContain(2);

    // No item was closed; the ordering changed only because comments changed.
    expect(processor.closedIssues).toHaveLength(0);
  });
});
