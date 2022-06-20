import {Issue} from '../src/classes/issue';
import {IIssue} from '../src/interfaces/issue';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';

let issuesProcessorBuilder: IssuesProcessorBuilder;
let issuesProcessor: IssuesProcessorMock;

describe('only-labels options', (): void => {
  beforeEach((): void => {
    issuesProcessorBuilder = new IssuesProcessorBuilder();
  });

  test('should stale when not set even if the issue has no label', async (): Promise<void> => {
    expect.assertions(1);
    issuesProcessor = issuesProcessorBuilder
      .emptyOnlyLabels()
      .issuesOrPrs([{labels: []}])
      .build();

    await issuesProcessor.processIssues();

    expect(issuesProcessor.staleIssues).toHaveLength(1);
  });

  test('should stale when not set even if the issue has a label', async (): Promise<void> => {
    expect.assertions(1);
    issuesProcessor = issuesProcessorBuilder
      .emptyOnlyLabels()
      .issuesOrPrs([{labels: [{name: 'label'}]}])
      .build();

    await issuesProcessor.processIssues();

    expect(issuesProcessor.staleIssues).toHaveLength(1);
  });

  test('should not stale when set and the issue has no label', async (): Promise<void> => {
    expect.assertions(1);
    issuesProcessor = issuesProcessorBuilder
      .onlyLabels('dummy-label')
      .issuesOrPrs([{labels: []}])
      .build();

    await issuesProcessor.processIssues();

    expect(issuesProcessor.staleIssues).toHaveLength(0);
  });

  test('should not stale when set and the issue has a different label', async (): Promise<void> => {
    expect.assertions(1);
    issuesProcessor = issuesProcessorBuilder
      .onlyLabels('dummy-label')
      .issuesOrPrs([
        {
          labels: [
            {
              name: 'label'
            }
          ]
        }
      ])
      .build();

    await issuesProcessor.processIssues();

    expect(issuesProcessor.staleIssues).toHaveLength(0);
  });

  test('should not stale when set and the issue has different labels', async (): Promise<void> => {
    expect.assertions(1);
    issuesProcessor = issuesProcessorBuilder
      .onlyLabels('dummy-label')
      .issuesOrPrs([
        {
          labels: [
            {
              name: 'label-1'
            },
            {
              name: 'label-2'
            }
          ]
        }
      ])
      .build();

    await issuesProcessor.processIssues();

    expect(issuesProcessor.staleIssues).toHaveLength(0);
  });

  test('should stale when set and the issue has the same label', async (): Promise<void> => {
    expect.assertions(1);
    issuesProcessor = issuesProcessorBuilder
      .onlyLabels('dummy-label')
      .issuesOrPrs([
        {
          labels: [
            {
              name: 'dummy-label'
            }
          ]
        }
      ])
      .build();

    await issuesProcessor.processIssues();

    expect(issuesProcessor.staleIssues).toHaveLength(1);
  });

  test('should not stale when set and the issue has only one of the same label', async (): Promise<void> => {
    expect.assertions(1);
    issuesProcessor = issuesProcessorBuilder
      .onlyLabels('dummy-label-1,dummy-label-2')
      .issuesOrPrs([
        {
          labels: [
            {
              name: 'dummy-label-1'
            }
          ]
        }
      ])
      .build();

    await issuesProcessor.processIssues();

    expect(issuesProcessor.staleIssues).toHaveLength(0);
  });

  test('should stale when set and the issue has all the same labels', async (): Promise<void> => {
    expect.assertions(1);
    issuesProcessor = issuesProcessorBuilder
      .onlyLabels('dummy-label-1,dummy-label-2')
      .issuesOrPrs([
        {
          labels: [
            {
              name: 'dummy-label-1'
            },
            {
              name: 'dummy-label-2'
            }
          ]
        }
      ])
      .build();

    await issuesProcessor.processIssues();

    expect(issuesProcessor.staleIssues).toHaveLength(1);
  });
});

describe('only-issue-labels option', (): void => {
  beforeEach((): void => {
    issuesProcessorBuilder = new IssuesProcessorBuilder();
  });

  describe('when the only-labels options is not set', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.emptyOnlyLabels();
    });

    test('should stale when not set even if the issue has no label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .emptyOnlyIssueLabels()
        .issues([{labels: []}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });

    test('should stale when not set even if the issue has a label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .emptyOnlyIssueLabels()
        .issues([{labels: [{name: 'dummy-label'}]}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });

    test('should not stale when set and the issue has no label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label')
        .issues([{labels: []}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the issue has a different label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label')
        .issues([
          {
            labels: [
              {
                name: 'label'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the issue has different labels', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label')
        .issues([
          {
            labels: [
              {
                name: 'label-1'
              },
              {
                name: 'label-2'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should stale when set and the issue has the same label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label')
        .issues([
          {
            labels: [
              {
                name: 'dummy-label'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });

    test('should not stale when set and the issue has only one of the same label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label-1,dummy-label-2')
        .issues([
          {
            labels: [
              {
                name: 'dummy-label-1'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should stale when set and the issue has all the same labels', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label-1,dummy-label-2')
        .issues([
          {
            labels: [
              {
                name: 'dummy-label-1'
              },
              {
                name: 'dummy-label-2'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });
  });

  describe('when the only-labels options is set (same as only-issue-labels)', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.onlyLabels('dummy-label');
    });

    test('should not stale when not set even if the issue has no label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .emptyOnlyIssueLabels()
        .issues([{labels: []}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when not set even if the issue has a label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .emptyOnlyIssueLabels()
        .issues([{labels: [{name: 'label'}]}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the issue has no label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label')
        .issues([{labels: []}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the issue has a different label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label')
        .issues([
          {
            labels: [
              {
                name: 'label'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the issue has different labels', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label')
        .issues([
          {
            labels: [
              {
                name: 'label-1'
              },
              {
                name: 'label-2'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should stale when set and the issue has the same label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label')
        .issues([
          {
            labels: [
              {
                name: 'dummy-label'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });

    test('should not stale when set and the issue has only one of the same label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label-1,dummy-label-2')
        .issues([
          {
            labels: [
              {
                name: 'dummy-label-1'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should stale when set and the issue has all the same labels', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label-1,dummy-label-2')
        .issues([
          {
            labels: [
              {
                name: 'dummy-label-1'
              },
              {
                name: 'dummy-label-2'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });
  });

  describe('when the only-labels options is set (different than only-issue-labels)', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.onlyLabels('dummy-only-label');
    });

    test('should not stale when not set even if the issue has no label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .emptyOnlyIssueLabels()
        .issues([{labels: []}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when not set even if the issue has a label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .emptyOnlyIssueLabels()
        .issues([{labels: [{name: 'label'}]}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the issue has no label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label')
        .issues([{labels: []}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the issue has a different label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label')
        .issues([
          {
            labels: [
              {
                name: 'label'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the issue has different labels', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label')
        .issues([
          {
            labels: [
              {
                name: 'label-1'
              },
              {
                name: 'label-2'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should stale when set and the issue has the same label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label')
        .issues([
          {
            labels: [
              {
                name: 'dummy-label'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });

    test('should not stale when set and the issue has only one of the same label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label-1,dummy-label-2')
        .issues([
          {
            labels: [
              {
                name: 'dummy-label-1'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should stale when set and the issue has all the same labels', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyIssueLabels('dummy-label-1,dummy-label-2')
        .issues([
          {
            labels: [
              {
                name: 'dummy-label-1'
              },
              {
                name: 'dummy-label-2'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });
  });
});

describe('only-pr-labels option', (): void => {
  beforeEach((): void => {
    issuesProcessorBuilder = new IssuesProcessorBuilder();
  });

  describe('when the only-labels options is not set', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.emptyOnlyLabels();
    });

    test('should stale when not set even if the pr has no label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .emptyOnlyPrLabels()
        .prs([{labels: []}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });

    test('should stale when not set even if the pr has a label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .emptyOnlyPrLabels()
        .prs([{labels: [{name: 'dummy-label'}]}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });

    test('should not stale when set and the pr has no label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label')
        .prs([{labels: []}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the pr has a different label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label')
        .prs([
          {
            labels: [
              {
                name: 'label'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the pr has different labels', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label')
        .prs([
          {
            labels: [
              {
                name: 'label-1'
              },
              {
                name: 'label-2'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should stale when set and the pr has the same label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label')
        .prs([
          {
            labels: [
              {
                name: 'dummy-label'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });

    test('should not stale when set and the pr has only one of the same label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label-1,dummy-label-2')
        .prs([
          {
            labels: [
              {
                name: 'dummy-label-1'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should stale when set and the pr has all the same labels', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label-1,dummy-label-2')
        .prs([
          {
            labels: [
              {
                name: 'dummy-label-1'
              },
              {
                name: 'dummy-label-2'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });
  });

  describe('when the only-labels options is set (same as only-pr-labels)', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.onlyLabels('dummy-label');
    });

    test('should not stale when not set even if the pr has no label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .emptyOnlyPrLabels()
        .prs([{labels: []}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when not set even if the pr has a label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .emptyOnlyPrLabels()
        .prs([{labels: [{name: 'label'}]}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the pr has no label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label')
        .prs([{labels: []}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the pr has a different label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label')
        .prs([
          {
            labels: [
              {
                name: 'label'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the pr has different labels', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label')
        .prs([
          {
            labels: [
              {
                name: 'label-1'
              },
              {
                name: 'label-2'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should stale when set and the pr has the same label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label')
        .prs([
          {
            labels: [
              {
                name: 'dummy-label'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });

    test('should not stale when set and the pr has only one of the same label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label-1,dummy-label-2')
        .prs([
          {
            labels: [
              {
                name: 'dummy-label-1'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should stale when set and the pr has all the same labels', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label-1,dummy-label-2')
        .prs([
          {
            labels: [
              {
                name: 'dummy-label-1'
              },
              {
                name: 'dummy-label-2'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });
  });

  describe('when the only-labels options is set (different than only-pr-labels)', (): void => {
    beforeEach((): void => {
      issuesProcessorBuilder.onlyLabels('dummy-only-label');
    });

    test('should not stale when not set even if the pr has no label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .emptyOnlyPrLabels()
        .prs([{labels: []}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when not set even if the pr has a label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .emptyOnlyPrLabels()
        .prs([{labels: [{name: 'label'}]}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the pr has no label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label')
        .prs([{labels: []}])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the pr has a different label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label')
        .prs([
          {
            labels: [
              {
                name: 'label'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should not stale when set and the pr has different labels', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label')
        .prs([
          {
            labels: [
              {
                name: 'label-1'
              },
              {
                name: 'label-2'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should stale when set and the pr has the same label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label')
        .prs([
          {
            labels: [
              {
                name: 'dummy-label'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });

    test('should not stale when set and the pr has only one of the same label', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label-1,dummy-label-2')
        .prs([
          {
            labels: [
              {
                name: 'dummy-label-1'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(0);
    });

    test('should stale when set and the pr has all the same labels', async (): Promise<void> => {
      expect.assertions(1);
      issuesProcessor = issuesProcessorBuilder
        .onlyPrLabels('dummy-label-1,dummy-label-2')
        .prs([
          {
            labels: [
              {
                name: 'dummy-label-1'
              },
              {
                name: 'dummy-label-2'
              }
            ]
          }
        ])
        .build();

      await issuesProcessor.processIssues();

      expect(issuesProcessor.staleIssues).toHaveLength(1);
    });
  });
});

class IssuesProcessorBuilder {
  private _options: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    daysBeforeStale: 0
  };
  private _issues: Issue[] = [];

  onlyLabels(labels: string): IssuesProcessorBuilder {
    this._options.onlyLabels = labels;

    return this;
  }

  onlyIssueLabels(labels: string): IssuesProcessorBuilder {
    this._options.onlyIssueLabels = labels;

    return this;
  }

  onlyPrLabels(labels: string): IssuesProcessorBuilder {
    this._options.onlyPrLabels = labels;

    return this;
  }

  emptyOnlyLabels(): IssuesProcessorBuilder {
    return this.onlyLabels('');
  }

  emptyOnlyIssueLabels(): IssuesProcessorBuilder {
    return this.onlyIssueLabels('');
  }

  emptyOnlyPrLabels(): IssuesProcessorBuilder {
    return this.onlyPrLabels('');
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

  build(): IssuesProcessorMock {
    return new IssuesProcessorMock(
      this._options,
      async p => (p === 1 ? this._issues : []),
      async () => [],
      async () => new Date().toDateString()
    );
  }
}
