import {Issue} from '../src/classes/issue';
import {IIssue} from '../src/interfaces/issue';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {ILabel} from '../src/interfaces/label';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';

let issuesProcessorBuilder: IssuesProcessorBuilder;
let issuesProcessor: IssuesProcessorMock;

/**
 * @description
 * Assuming there is a comment on the issue
 */
describe('remove-stale-when-updated option', (): void => {
  beforeEach((): void => {
    issuesProcessorBuilder = new IssuesProcessorBuilder();
  });

  describe('when the option "remove-stale-when-updated" is disabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.keepStaleWhenUpdated();
    });

    test('should not remove the stale label on the issue', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
    });

    test('should not remove the stale label on the pull request', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
    });
  });

  describe('when the option "remove-stale-when-updated" is enabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.removeStaleWhenUpdated();
    });

    test('should remove the stale label on the issue', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
    });

    test('should remove the stale label on the pull request', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
    });
  });
});

describe('remove-issue-stale-when-updated option', (): void => {
  beforeEach((): void => {
    issuesProcessorBuilder = new IssuesProcessorBuilder();
  });

  describe('when the option "remove-stale-when-updated" is disabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.keepStaleWhenUpdated();
    });

    describe('when the option "remove-issue-stale-when-updated" is unset', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.unsetIssueStaleWhenUpdated();
      });

      test('should not remove the stale label on the issue', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
      });

      test('should not remove the stale label on the pull request', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
      });
    });

    describe('when the option "remove-issue-stale-when-updated" is disabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.keepIssueStaleWhenUpdated();
      });

      test('should not remove the stale label on the issue', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
      });

      test('should not remove the stale label on the pull request', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
      });
    });

    describe('when the option "remove-issue-stale-when-updated" is enabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.removeIssueStaleWhenUpdated();
      });

      test('should remove the stale label on the issue', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
      });

      test('should not remove the stale label on the pull request', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
      });
    });
  });

  describe('when the option "remove-stale-when-updated" is enabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.removeStaleWhenUpdated();
    });

    describe('when the option "remove-issue-stale-when-updated" is unset', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.unsetIssueStaleWhenUpdated();
      });

      test('should remove the stale label on the issue', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
      });

      test('should remove the stale label on the pull request', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
      });
    });

    describe('when the option "remove-issue-stale-when-updated" is disabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.keepIssueStaleWhenUpdated();
      });

      test('should not remove the stale label on the issue', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
      });

      test('should remove the stale label on the pull request', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
      });
    });

    describe('when the option "remove-issue-stale-when-updated" is enabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.removeIssueStaleWhenUpdated();
      });

      test('should remove the stale label on the issue', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
      });

      test('should remove the stale label on the pull request', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
      });
    });
  });
});

describe('remove-pr-stale-when-updated option', (): void => {
  beforeEach((): void => {
    issuesProcessorBuilder = new IssuesProcessorBuilder();
  });

  describe('when the option "remove-stale-when-updated" is disabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.keepStaleWhenUpdated();
    });

    describe('when the option "remove-pr-stale-when-updated" is unset', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.unsetPrStaleWhenUpdated();
      });

      test('should not remove the stale label on the issue', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
      });

      test('should not remove the stale label on the pull request', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
      });
    });

    describe('when the option "remove-pr-stale-when-updated" is disabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.keepPrStaleWhenUpdated();
      });

      test('should not remove the stale label on the issue', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
      });

      test('should not remove the stale label on the pull request', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
      });
    });

    describe('when the option "remove-pr-stale-when-updated" is enabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.removePrStaleWhenUpdated();
      });

      test('should not remove the stale label on the issue', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
      });

      test('should remove the stale label on the pull request', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
      });
    });
  });

  describe('when the option "remove-stale-when-updated" is enabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.removeStaleWhenUpdated();
    });

    describe('when the option "remove-pr-stale-when-updated" is unset', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.unsetPrStaleWhenUpdated();
      });

      test('should remove the stale label on the issue', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
      });

      test('should remove the stale label on the pull request', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
      });
    });

    describe('when the option "remove-pr-stale-when-updated" is disabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.keepPrStaleWhenUpdated();
      });

      test('should remove the stale label on the issue', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
      });

      test('should not remove the stale label on the pull request', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(0);
      });
    });

    describe('when the option "remove-pr-stale-when-updated" is enabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.removePrStaleWhenUpdated();
      });

      test('should remove the stale label on the issue', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.staleIssues([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
      });

      test('should remove the stale label on the pull request', async (): Promise<void> => {
        expect.assertions(1);
        issuesProcessor = issuesProcessorBuilder.stalePrs([{}]).build();

        await issuesProcessor.processIssues();

        expect(issuesProcessor.removedLabelIssues).toHaveLength(1);
      });
    });
  });
});

class IssuesProcessorBuilder {
  private _options: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions
  };
  private _issues: Issue[] = [];

  keepStaleWhenUpdated(): IssuesProcessorBuilder {
    this._options.removeStaleWhenUpdated = false;

    return this;
  }

  removeStaleWhenUpdated(): IssuesProcessorBuilder {
    this._options.removeStaleWhenUpdated = true;

    return this;
  }

  unsetIssueStaleWhenUpdated(): IssuesProcessorBuilder {
    delete this._options.removeIssueStaleWhenUpdated;

    return this;
  }

  keepIssueStaleWhenUpdated(): IssuesProcessorBuilder {
    this._options.removeIssueStaleWhenUpdated = false;

    return this;
  }

  removeIssueStaleWhenUpdated(): IssuesProcessorBuilder {
    this._options.removeIssueStaleWhenUpdated = true;

    return this;
  }

  unsetPrStaleWhenUpdated(): IssuesProcessorBuilder {
    delete this._options.removePrStaleWhenUpdated;

    return this;
  }

  keepPrStaleWhenUpdated(): IssuesProcessorBuilder {
    this._options.removePrStaleWhenUpdated = false;

    return this;
  }

  removePrStaleWhenUpdated(): IssuesProcessorBuilder {
    this._options.removePrStaleWhenUpdated = true;

    return this;
  }

  issuesOrPrs(issues: Partial<IIssue>[]): IssuesProcessorBuilder {
    this._issues = issues.map(
      (issue: Readonly<Partial<IIssue>>, index: Readonly<number>): Issue =>
        generateIssue(
          this._options,
          index,
          issue.title ?? 'dummy-title',
          issue.updated_at ?? new Date().toDateString(),
          issue.created_at ?? new Date().toDateString(),
          !!issue.pull_request,
          issue.labels ? issue.labels.map(label => label.name || '') : []
        )
    );

    return this;
  }

  issues(issues: Partial<IIssue>[]): IssuesProcessorBuilder {
    this.issuesOrPrs(
      issues.map((issue: Readonly<Partial<IIssue>>): Partial<IIssue> => {
        return {
          ...issue,
          pull_request: null
        };
      })
    );

    return this;
  }

  staleIssues(issues: Partial<IIssue>[]): IssuesProcessorBuilder {
    this.issues(
      issues.map((issue: Readonly<Partial<IIssue>>): Partial<IIssue> => {
        return {
          ...issue,
          updated_at: '2020-01-01T17:00:00Z',
          created_at: '2020-01-01T17:00:00Z',
          labels: issue.labels?.map((label: Readonly<ILabel>): ILabel => {
            return {
              ...label,
              name: 'Stale'
            };
          }) ?? [
            {
              name: 'Stale'
            }
          ]
        };
      })
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

  stalePrs(issues: Partial<IIssue>[]): IssuesProcessorBuilder {
    this.prs(
      issues.map((issue: Readonly<Partial<IIssue>>): Partial<IIssue> => {
        return {
          ...issue,
          updated_at: '2020-01-01T17:00:00Z',
          created_at: '2020-01-01T17:00:00Z',
          labels: issue.labels?.map((label: Readonly<ILabel>): ILabel => {
            return {
              ...label,
              name: 'Stale'
            };
          }) ?? [
            {
              name: 'Stale'
            }
          ]
        };
      })
    );

    return this;
  }

  build(): IssuesProcessorMock {
    return new IssuesProcessorMock(
      this._options,
      async p => (p === 1 ? this._issues : []),
      async () => [
        {
          user: {
            login: 'notme',
            type: 'User'
          },
          body: 'body'
        }
      ],
      async () => new Date().toDateString()
    );
  }
}
