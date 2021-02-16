import {IIssue} from '../interfaces/issue';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {ILabel} from '../interfaces/label';
import {IMilestone} from '../interfaces/milestone';
import {Issue} from './issue';

describe('Issue', (): void => {
  let issue: Issue;
  let optionsInterface: IIssuesProcessorOptions;
  let issueInterface: IIssue;

  beforeEach((): void => {
    optionsInterface = {
      ascending: false,
      closeIssueLabel: '',
      closeIssueMessage: '',
      closePrLabel: '',
      closePrMessage: '',
      daysBeforeClose: 0,
      daysBeforeIssueClose: 0,
      daysBeforeIssueStale: 0,
      daysBeforePrClose: 0,
      daysBeforePrStale: 0,
      daysBeforeStale: 0,
      debugOnly: false,
      deleteBranch: false,
      exemptIssueLabels: '',
      exemptIssueMilestones: '',
      exemptMilestones: '',
      exemptPrLabels: '',
      exemptPrMilestones: '',
      onlyLabels: '',
      operationsPerRun: 0,
      removeStaleWhenUpdated: false,
      repoToken: '',
      skipStaleIssueMessage: false,
      skipStalePrMessage: false,
      staleIssueMessage: '',
      stalePrMessage: '',
      startDate: undefined,
      stalePrLabel: 'dummy-stale-pr-label',
      staleIssueLabel: 'dummy-stale-issue-label',
      exemptAllMilestones: false,
      exemptAllIssueMilestones: undefined,
      exemptAllPrMilestones: undefined
    };
    issueInterface = {
      title: 'dummy-title',
      number: 8,
      created_at: 'dummy-created-at',
      updated_at: 'dummy-updated-at',
      labels: [
        {
          name: 'dummy-name'
        }
      ],
      pull_request: {},
      state: 'dummy-state',
      locked: false,
      milestone: {
        title: 'dummy-milestone'
      }
    };
    issue = new Issue(optionsInterface, issueInterface);
  });

  describe('constructor()', (): void => {
    it('should set the title with the given issue title', (): void => {
      expect.assertions(1);

      expect(issue.title).toStrictEqual('dummy-title');
    });

    it('should set the number with the given issue number', (): void => {
      expect.assertions(1);

      expect(issue.number).toStrictEqual(8);
    });

    it('should set the created_at with the given issue created_at', (): void => {
      expect.assertions(1);

      expect(issue.created_at).toStrictEqual('dummy-created-at');
    });

    it('should set the updated_at with the given issue updated_at', (): void => {
      expect.assertions(1);

      expect(issue.updated_at).toStrictEqual('dummy-updated-at');
    });

    it('should set the labels with the given issue labels', (): void => {
      expect.assertions(1);

      expect(issue.labels).toStrictEqual([
        {
          name: 'dummy-name'
        } as ILabel
      ]);
    });

    it('should set the pull_request with the given issue pull_request', (): void => {
      expect.assertions(1);

      expect(issue.pull_request).toStrictEqual({});
    });

    it('should set the state with the given issue state', (): void => {
      expect.assertions(1);

      expect(issue.state).toStrictEqual('dummy-state');
    });

    it('should set the locked with the given issue locked', (): void => {
      expect.assertions(1);

      expect(issue.locked).toStrictEqual(false);
    });

    it('should set the milestone with the given issue milestone', (): void => {
      expect.assertions(1);

      expect(issue.milestone).toStrictEqual({
        title: 'dummy-milestone'
      } as IMilestone);
    });

    describe('when the given issue pull_request is not set', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = undefined;
        issue = new Issue(optionsInterface, issueInterface);
      });

      it('should set the isPullRequest to false', (): void => {
        expect.assertions(1);

        expect(issue.isPullRequest).toStrictEqual(false);
      });
    });

    describe('when the given issue pull_request is set', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = {};
        issue = new Issue(optionsInterface, issueInterface);
      });

      it('should set the isPullRequest to true', (): void => {
        expect.assertions(1);

        expect(issue.isPullRequest).toStrictEqual(true);
      });
    });

    describe('when the given issue is not a pull request', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = undefined;
        issue = new Issue(optionsInterface, issueInterface);
      });

      it('should set the staleLabel with the given option staleIssueLabel', (): void => {
        expect.assertions(1);

        expect(issue.staleLabel).toStrictEqual('dummy-stale-issue-label');
      });
    });

    describe('when the given issue is a pull request', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = {};
        issue = new Issue(optionsInterface, issueInterface);
      });

      it('should set the staleLabel with the given option stalePrLabel', (): void => {
        expect.assertions(1);

        expect(issue.staleLabel).toStrictEqual('dummy-stale-pr-label');
      });
    });

    describe('when the given issue does not contains the stale label', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = undefined;
        issueInterface.labels = [];
        issue = new Issue(optionsInterface, issueInterface);
      });

      it('should set the isStale to false', (): void => {
        expect.assertions(1);

        expect(issue.isStale).toStrictEqual(false);
      });
    });

    describe('when the given issue contains the stale label', (): void => {
      beforeEach((): void => {
        issueInterface.pull_request = undefined;
        issueInterface.labels = [
          {
            name: 'dummy-stale-issue-label'
          } as ILabel
        ];
        issue = new Issue(optionsInterface, issueInterface);
      });

      it('should set the isStale to true', (): void => {
        expect.assertions(1);

        expect(issue.isStale).toStrictEqual(true);
      });
    });
  });
});
