import {Issue} from '../src/classes/issue';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';

describe('any-of-labels option', () => {
  test('should do nothing when not set', async () => {
    const sut = new IssuesProcessorBuilder()
      .emptyAnyOfLabels()
      .issues([{labels: [{name: 'some-label'}]}])
      .build();

    await sut.processIssues();

    expect(sut.staleIssues).toHaveLength(1);
  });

  test('should skip it when none of the issue labels match', async () => {
    const sut = new IssuesProcessorBuilder()
      .anyOfLabels('skip-this-issue,and-this-one')
      .issues([{labels: [{name: 'some-label'}, {name: 'some-other-label'}]}])
      .build();

    await sut.processIssues();

    expect(sut.staleIssues).toHaveLength(0);
  });

  test('should skip it when the issue has no labels', async () => {
    const sut = new IssuesProcessorBuilder()
      .anyOfLabels('skip-this-issue,and-this-one')
      .issues([{labels: []}])
      .build();

    await sut.processIssues();

    expect(sut.staleIssues).toHaveLength(0);
  });

  test('should process it when one of the issue labels match', async () => {
    const sut = new IssuesProcessorBuilder()
      .anyOfLabels('skip-this-issue,and-this-one')
      .issues([{labels: [{name: 'some-label'}, {name: 'skip-this-issue'}]}])
      .build();

    await sut.processIssues();

    expect(sut.staleIssues).toHaveLength(1);
  });

  test('should process it when all the issue labels match', async () => {
    const sut = new IssuesProcessorBuilder()
      .anyOfLabels('skip-this-issue,and-this-one')
      .issues([{labels: [{name: 'and-this-one'}, {name: 'skip-this-issue'}]}])
      .build();

    await sut.processIssues();

    expect(sut.staleIssues).toHaveLength(1);
  });
});

class IssuesProcessorBuilder {
  private _options: IIssuesProcessorOptions;
  private _issues: Issue[];

  constructor() {
    this._options = {...DefaultProcessorOptions};
    this._issues = [];
  }

  anyOfLabels(labels: string): IssuesProcessorBuilder {
    this._options.anyOfLabels = labels;
    return this;
  }

  emptyAnyOfLabels(): IssuesProcessorBuilder {
    return this.anyOfLabels('');
  }

  issues(issues: Partial<Issue>[]): IssuesProcessorBuilder {
    this._issues = issues.map(
      (issue, index): Issue =>
        generateIssue(
          this._options,
          index,
          issue.title || 'Issue title',
          issue.updated_at || '2000-01-01T00:00:00Z', // we only care about stale/expired issues here
          issue.created_at || '2000-01-01T00:00:00Z',
          issue.isPullRequest || false,
          issue.labels ? issue.labels.map(label => label.name) : []
        )
    );
    return this;
  }

  build(): IssuesProcessorMock {
    return new IssuesProcessorMock(
      this._options,
      async () => 'abot',
      async p => (p === 1 ? this._issues : []),
      async () => [],
      async () => new Date().toDateString()
    );
  }
}
