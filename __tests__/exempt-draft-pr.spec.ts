import {Issue} from '../src/classes/issue';
import {IIssue} from '../src/interfaces/issue';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IPullRequest} from '../src/interfaces/pull-request';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';

let issuesProcessorBuilder: IssuesProcessorBuilder;
let issuesProcessor: IssuesProcessorMock;

describe('exempt-draft-pr option', (): void => {
  beforeEach((): void => {
    issuesProcessorBuilder = new IssuesProcessorBuilder();
  });

  describe('when the option "exempt-draft-pr" is disabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.processDraftPr();
    });

    test('should stale the pull request', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .toStalePrs([
          {
            number: 10
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });
  });

  describe('when the option "exempt-draft-pr" is enabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.exemptDraftPr();
    });

    test('should not stale the pull request', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .toStalePrs([
          {
            number: 20
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });
  });
});

class IssuesProcessorBuilder {
  private _options: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions
  };
  private _issues: Issue[] = [];

  processDraftPr(): IssuesProcessorBuilder {
    this._options.exemptDraftPr = false;

    return this;
  }

  exemptDraftPr(): IssuesProcessorBuilder {
    this._options.exemptDraftPr = true;

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

  toStalePrs(issues: Partial<IIssue>[]): IssuesProcessorBuilder {
    this.prs(
      issues.map((issue: Readonly<Partial<IIssue>>): Partial<IIssue> => {
        return {
          ...issue,
          updated_at: '2020-01-01T17:00:00Z',
          created_at: '2020-01-01T17:00:00Z'
        };
      })
    );

    return this;
  }

  build(): IssuesProcessorMock {
    return new IssuesProcessorMock(
      this._options,
      async p => (p === 1 ? this._issues : []),
      async () => [],
      async () => new Date().toDateString(),
      async (): Promise<IPullRequest> => {
        return Promise.resolve({
          number: 0,
          draft: true,
          head: {
            ref: 'ref'
          }
        });
      }
    );
  }
}
