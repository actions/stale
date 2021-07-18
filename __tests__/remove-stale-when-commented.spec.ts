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
describe('remove-stale-when-commented option', (): void => {
  beforeEach((): void => {
    issuesProcessorBuilder = new IssuesProcessorBuilder();
  });

  describe('when the option "remove-stale-when-commented" is disabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.keepStaleWhenCommented();
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

  describe('when the option "remove-stale-when-commented" is enabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.removeStaleWhenCommented();
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

describe('remove-issue-stale-when-commented option', (): void => {
  beforeEach((): void => {
    issuesProcessorBuilder = new IssuesProcessorBuilder();
  });

  describe('when the option "remove-stale-when-commented" is disabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.keepStaleWhenCommented();
    });

    describe('when the option "remove-issue-stale-when-commented" is unset', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.unsetIssueStaleWhenCommented();
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

    describe('when the option "remove-issue-stale-when-commented" is disabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.keepIssueStaleWhenCommented();
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

    describe('when the option "remove-issue-stale-when-commented" is enabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.removeIssueStaleWhenCommented();
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

  describe('when the option "remove-stale-when-commented" is enabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.removeStaleWhenCommented();
    });

    describe('when the option "remove-issue-stale-when-commented" is unset', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.unsetIssueStaleWhenCommented();
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

    describe('when the option "remove-issue-stale-when-commented" is disabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.keepIssueStaleWhenCommented();
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

    describe('when the option "remove-issue-stale-when-commented" is enabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.removeIssueStaleWhenCommented();
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

describe('remove-pr-stale-when-commented option', (): void => {
  beforeEach((): void => {
    issuesProcessorBuilder = new IssuesProcessorBuilder();
  });

  describe('when the option "remove-stale-when-commented" is disabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.keepStaleWhenCommented();
    });

    describe('when the option "remove-pr-stale-when-commented" is unset', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.unsetPrStaleWhenCommented();
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

    describe('when the option "remove-pr-stale-when-commented" is disabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.keepPrStaleWhenCommented();
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

    describe('when the option "remove-pr-stale-when-commented" is enabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.removePrStaleWhenCommented();
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

  describe('when the option "remove-stale-when-commented" is enabled', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.removeStaleWhenCommented();
    });

    describe('when the option "remove-pr-stale-when-commented" is unset', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.unsetPrStaleWhenCommented();
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

    describe('when the option "remove-pr-stale-when-commented" is disabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.keepPrStaleWhenCommented();
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

    describe('when the option "remove-pr-stale-when-commented" is enabled', (): void => {
      beforeEach((): void => {
        issuesProcessorBuilder.removePrStaleWhenCommented();
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

  keepStaleWhenCommented(): IssuesProcessorBuilder {
    this._options.removeStaleWhenCommented = false;

    return this;
  }

  removeStaleWhenCommented(): IssuesProcessorBuilder {
    this._options.removeStaleWhenCommented = true;

    return this;
  }

  unsetIssueStaleWhenCommented(): IssuesProcessorBuilder {
    delete this._options.removeIssueStaleWhenCommented;

    return this;
  }

  keepIssueStaleWhenCommented(): IssuesProcessorBuilder {
    this._options.removeIssueStaleWhenCommented = false;

    return this;
  }

  removeIssueStaleWhenCommented(): IssuesProcessorBuilder {
    this._options.removeIssueStaleWhenCommented = true;

    return this;
  }

  unsetPrStaleWhenCommented(): IssuesProcessorBuilder {
    delete this._options.removePrStaleWhenCommented;

    return this;
  }

  keepPrStaleWhenCommented(): IssuesProcessorBuilder {
    this._options.removePrStaleWhenCommented = false;

    return this;
  }

  removePrStaleWhenCommented(): IssuesProcessorBuilder {
    this._options.removePrStaleWhenCommented = true;

    return this;
  }

  issuesOrPrs(issues: Partial<IIssue>[]): IssuesProcessorBuilder {
    this._issues = issues.map(
      (issue: Readonly<Partial<IIssue>>, index: Readonly<number>): Issue =>
        generateIssue(
          this._options,
          index,
          issue.title ?? 'dummy-title',
          issue.updated_at ?? new Date().toISOString(),
          issue.created_at ?? new Date().toISOString(),
          !!issue.pull_request,
          issue.labels ? issue.labels.map(label => label.name) : []
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
          // Note this comment
          user: {
            login: 'notme',
            type: 'User'
          },
          body: 'Body'
        }
      ],
      async () => new Date().toISOString()
    );
  }
}
