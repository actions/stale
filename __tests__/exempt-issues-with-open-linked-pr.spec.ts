import {beforeEach, describe, expect, test} from '@jest/globals';
import {Issue} from '../src/classes/issue.js';
import {IIssue} from '../src/interfaces/issue.js';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options.js';
import {IssuesProcessorMock} from './classes/issues-processor-mock.js';
import {DefaultProcessorOptions} from './constants/default-processor-options.js';
import {generateIssue} from './functions/generate-issue.js';
import {alwaysFalseStateMock} from './classes/state-mock.js';

let issuesProcessorBuilder: IssuesProcessorBuilder;
let issuesProcessor: IssuesProcessorMock;

describe('exempt-issues-with-open-linked-pr option', (): void => {
  beforeEach((): void => {
    issuesProcessorBuilder = new IssuesProcessorBuilder();
  });

  describe('when the option "exempt-issues-with-open-linked-pr" is disabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.processIssuesWithOpenLinkedPr();
    });

    test('should stale the issue even if an open pull request will close it', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .toStaleIssues([{number: 10}])
        .withOpenLinkedPullRequest(true)
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });

    test('should not consume an extra operation to look for linked pull requests', async (): Promise<void> => {
      expect.assertions(1);
      let calls = 0;
      issuesProcessor = issuesProcessorBuilder
        .toStaleIssues([{number: 11}])
        .withLinkedPullRequestCallback(async (): Promise<boolean> => {
          calls++;

          return true;
        })
        .build();

      await issuesProcessor.processIssues();

      expect(calls).toStrictEqual(0);
    });
  });

  describe('when the option "exempt-issues-with-open-linked-pr" is enabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.exemptIssuesWithOpenLinkedPr();
    });

    test('should not stale the issue when an open pull request will close it', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .toStaleIssues([{number: 20}])
        .withOpenLinkedPullRequest(true)
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should stale the issue when no open pull request will close it', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .toStaleIssues([{number: 21}])
        .withOpenLinkedPullRequest(false)
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });

    test('should stale the pull request because a pull request cannot have a linked pull request', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .toStalePrs([{number: 22}])
        .withOpenLinkedPullRequest(true)
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });

    test('should stale the issue when the linked pull requests cannot be fetched', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .toStaleIssues([{number: 23}])
        .withLinkedPullRequestCallback(async (): Promise<boolean> => {
          // Mirrors the processor swallowing the API error and carrying on
          return false;
        })
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });
  });
});

class IssuesProcessorBuilder {
  private _options: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions
  };
  private _issues: Issue[] = [];
  private _hasOpenLinkedPullRequest: (issue: Issue) => Promise<boolean> =
    async (): Promise<boolean> => false;

  processIssuesWithOpenLinkedPr(): IssuesProcessorBuilder {
    this._options.exemptIssuesWithOpenLinkedPr = false;

    return this;
  }

  exemptIssuesWithOpenLinkedPr(): IssuesProcessorBuilder {
    this._options.exemptIssuesWithOpenLinkedPr = true;

    return this;
  }

  withOpenLinkedPullRequest(hasOne: boolean): IssuesProcessorBuilder {
    this._hasOpenLinkedPullRequest = async (): Promise<boolean> => hasOne;

    return this;
  }

  withLinkedPullRequestCallback(
    callback: (issue: Issue) => Promise<boolean>
  ): IssuesProcessorBuilder {
    this._hasOpenLinkedPullRequest = callback;

    return this;
  }

  issuesOrPrs(issues: Partial<IIssue>[]): IssuesProcessorBuilder {
    this._issues = issues.map(
      (issue: Readonly<Partial<IIssue>>, index: Readonly<number>): Issue =>
        generateIssue(
          this._options,
          issue.number ?? index,
          issue.title ?? 'dummy-title',
          issue.updated_at ?? new Date().toDateString(),
          issue.created_at ?? new Date().toDateString(),
          !!issue.draft,
          !!issue.pull_request,
          issue.labels ? issue.labels.map(label => label.name || '') : []
        )
    );

    return this;
  }

  prs(issues: Partial<IIssue>[]): IssuesProcessorBuilder {
    this.issuesOrPrs(
      issues.map((issue: Readonly<Partial<IIssue>>): Partial<IIssue> => {
        return {
          ...issue,
          pull_request: {key: 'value'}
        };
      })
    );

    return this;
  }

  private _staleDates(issues: Partial<IIssue>[]): Partial<IIssue>[] {
    return issues.map((issue: Readonly<Partial<IIssue>>): Partial<IIssue> => {
      return {
        ...issue,
        updated_at: '2020-01-01T17:00:00Z',
        created_at: '2020-01-01T17:00:00Z'
      };
    });
  }

  toStaleIssues(issues: Partial<IIssue>[]): IssuesProcessorBuilder {
    this.issuesOrPrs(this._staleDates(issues));

    return this;
  }

  toStalePrs(issues: Partial<IIssue>[]): IssuesProcessorBuilder {
    this.prs(this._staleDates(issues));

    return this;
  }

  build(): IssuesProcessorMock {
    return new IssuesProcessorMock(
      this._options,
      alwaysFalseStateMock,
      async p => (p === 1 ? this._issues : []),
      async () => [],
      async () => new Date().toDateString(),
      undefined,
      undefined,
      this._hasOpenLinkedPullRequest
    );
  }
}
