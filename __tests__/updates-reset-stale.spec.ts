import {beforeEach, describe, expect, it, jest, test} from '@jest/globals';
import {context} from '@actions/github';
import {Issue} from '../src/classes/issue.js';
import {IComment} from '../src/interfaces/comment.js';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options.js';
import {IsoDateString} from '../src/types/iso-date-string.js';
import {IssuesProcessorMock} from './classes/issues-processor-mock.js';
import {DefaultProcessorOptions} from './constants/default-processor-options.js';
import {generateIssue} from './functions/generate-issue.js';
import {alwaysFalseStateMock} from './classes/state-mock.js';

describe('ignore-updates options', (): void => {
  let sut: SUT;

  beforeEach((): void => {
    sut = new SUT();
  });

  describe('when the issue should be stale within 10 days and was created 20 days ago and updated 5 days ago', (): void => {
    beforeEach((): void => {
      sut.toIssue().staleIn(10).created(20).updated(5);
    });

    describe('when the ignore updates option is disabled', (): void => {
      beforeEach((): void => {
        sut.staleOnUpdates();
      });

      it('should not stale the issue', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(0);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the ignore issue updates option is enabled', (): void => {
        beforeEach((): void => {
          sut.ignoreIssueUpdates();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore issue updates option is disabled', (): void => {
        beforeEach((): void => {
          sut.staleOnIssueUpdates();
        });

        it('should not stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(0);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore issue updates option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetIgnoreIssueUpdates();
        });

        it('should not stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(0);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });
    });

    describe('when the ignore updates option is enabled', (): void => {
      beforeEach((): void => {
        sut.ignoreUpdates();
      });

      it('should stale the issue', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the ignore issue updates option is enabled', (): void => {
        beforeEach((): void => {
          sut.ignoreIssueUpdates();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore issue updates option is disabled', (): void => {
        beforeEach((): void => {
          sut.staleOnIssueUpdates();
        });

        it('should not stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(0);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore issue updates option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetIgnoreIssueUpdates();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });
    });
  });

  describe('when the issue should be stale within 10 days and was created 20 days ago and updated 15 days ago', (): void => {
    beforeEach((): void => {
      sut.toIssue().staleIn(10).created(20).updated(15);
    });

    describe('when the ignore updates option is disabled', (): void => {
      beforeEach((): void => {
        sut.staleOnUpdates();
      });

      it('should stale the issue', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the ignore issue updates option is enabled', (): void => {
        beforeEach((): void => {
          sut.ignoreIssueUpdates();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore issue updates option is disabled', (): void => {
        beforeEach((): void => {
          sut.staleOnIssueUpdates();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore issue updates option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetIgnoreIssueUpdates();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });
    });

    describe('when the ignore updates option is enabled', (): void => {
      beforeEach((): void => {
        sut.ignoreUpdates();
      });

      it('should stale the issue', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the ignore issue updates option is enabled', (): void => {
        beforeEach((): void => {
          sut.ignoreIssueUpdates();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore issue updates option is disabled', (): void => {
        beforeEach((): void => {
          sut.staleOnIssueUpdates();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore issue updates option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetIgnoreIssueUpdates();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });
    });
  });

  describe('when the pull request should be stale within 10 days and was created 20 days ago and updated 5 days ago', (): void => {
    beforeEach((): void => {
      sut.toPullRequest().staleIn(10).created(20).updated(5);
    });

    describe('when the ignore updates option is disabled', (): void => {
      beforeEach((): void => {
        sut.staleOnUpdates();
      });

      it('should not stale the pull request', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(0);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the ignore pull request updates option is enabled', (): void => {
        beforeEach((): void => {
          sut.ignorePullRequestUpdates();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore pull request updates option is disabled', (): void => {
        beforeEach((): void => {
          sut.staleOnPullRequestUpdates();
        });

        it('should not stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(0);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore pull request updates option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetIgnorePullRequestUpdates();
        });

        it('should not stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(0);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });
    });

    describe('when the ignore updates option is enabled', (): void => {
      beforeEach((): void => {
        sut.ignoreUpdates();
      });

      it('should stale the pull request', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the ignore pull request updates option is enabled', (): void => {
        beforeEach((): void => {
          sut.ignorePullRequestUpdates();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore pull request updates option is disabled', (): void => {
        beforeEach((): void => {
          sut.staleOnPullRequestUpdates();
        });

        it('should not stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(0);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore pull request updates option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetIgnorePullRequestUpdates();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });
    });
  });

  describe('when the pull request should be stale within 10 days and was created 20 days ago and updated 15 days ago', (): void => {
    beforeEach((): void => {
      sut.toPullRequest().staleIn(10).created(20).updated(15);
    });

    describe('when the ignore updates option is disabled', (): void => {
      beforeEach((): void => {
        sut.staleOnUpdates();
      });

      it('should stale the pull request', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the ignore pull request updates option is enabled', (): void => {
        beforeEach((): void => {
          sut.ignorePullRequestUpdates();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore pull request updates option is disabled', (): void => {
        beforeEach((): void => {
          sut.staleOnPullRequestUpdates();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore pull request updates option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetIgnorePullRequestUpdates();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });
    });

    describe('when the ignore updates option is enabled', (): void => {
      beforeEach((): void => {
        sut.ignoreUpdates();
      });

      it('should stale the pull request', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the ignore pull request updates option is enabled', (): void => {
        beforeEach((): void => {
          sut.ignorePullRequestUpdates();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore pull request updates option is disabled', (): void => {
        beforeEach((): void => {
          sut.staleOnPullRequestUpdates();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the ignore pull request updates option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetIgnorePullRequestUpdates();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });
    });
  });
});

describe('ignore-pr-comment-updates option', (): void => {
  let sut: SUT;

  beforeEach((): void => {
    sut = new SUT();
    sut
      .toPullRequest()
      .created(30)
      .staleSince(10)
      .closeIn(7)
      .removeStaleWhenUpdated();
  });

  describe('when a comment was created 20 days ago and updated after the pull request became stale', (): void => {
    beforeEach((): void => {
      sut.commentCreated(20);
    });

    describe('when the ignore pull request comment updates option is enabled', (): void => {
      beforeEach((): void => {
        sut.ignorePullRequestCommentUpdates();
      });

      it('should close the pull request without removing the stale label', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(0);
        expect(sut.processor.closedIssues).toHaveLength(1);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when there is also a comment created 5 days ago', (): void => {
        beforeEach((): void => {
          sut.commentCreated(5);
        });

        it('should remove the stale label without closing the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(0);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(1);
        });
      });

      describe('when the pull request itself was updated 5 days ago', (): void => {
        beforeEach((): void => {
          sut.updated(5);
        });

        it('should remove the stale label without closing the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(0);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(1);
        });
      });

      describe('when the item is an issue', (): void => {
        beforeEach((): void => {
          sut.toIssue();
        });

        it('should remove the stale label without closing the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(0);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(1);
        });
      });
    });

    describe('when the ignore pull request comment updates option is disabled', (): void => {
      beforeEach((): void => {
        sut.staleOnPullRequestCommentUpdates();
      });

      it('should remove the stale label without closing the pull request', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(0);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(1);
      });
    });

    describe('when the ignore pull request comment updates option is left at its default', (): void => {
      it('should remove the stale label without closing the pull request', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(0);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(1);
      });
    });
  });

  describe('when a comment was created at the same time the pull request became stale', (): void => {
    beforeEach((): void => {
      sut.ignorePullRequestCommentUpdates().commentCreatedWhenMarkedStale();
    });

    it('should remove the stale label without closing the pull request', async () => {
      expect.assertions(3);

      await sut.test();

      expect(sut.processor.staleIssues).toHaveLength(0);
      expect(sut.processor.closedIssues).toHaveLength(0);
      expect(sut.processor.removedLabelIssues).toHaveLength(1);
    });
  });

  describe('when only bot and stale-message comments were created after the pull request became stale', (): void => {
    beforeEach((): void => {
      sut
        .ignorePullRequestCommentUpdates()
        .commentCreated(5, 'A bot comment', 'Bot')
        .commentCreated(5, DefaultProcessorOptions.stalePrMessage);
    });

    it('should close the pull request without removing the stale label', async () => {
      expect.assertions(3);

      await sut.test();

      expect(sut.processor.staleIssues).toHaveLength(0);
      expect(sut.processor.closedIssues).toHaveLength(1);
      expect(sut.processor.removedLabelIssues).toHaveLength(0);
    });
  });
});

class SUT {
  processor!: IssuesProcessorMock;
  private _opts: IIssuesProcessorOptions = {...DefaultProcessorOptions};
  private _isPullRequest = false;
  private _createdAt: IsoDateString = '2020-01-01T17:00:00Z';
  private _updatedAt: IsoDateString = '2020-01-01T17:00:00Z';
  private _testIssueList: Issue[] = [];
  private _markedStaleAt: IsoDateString | undefined;
  private _comments: (IComment & {
    created_at: IsoDateString;
    updated_at: IsoDateString;
  })[] = [];

  toIssue(): SUT {
    this._isPullRequest = false;

    return this;
  }

  toPullRequest(): SUT {
    this._isPullRequest = true;

    return this;
  }

  staleIn(days: number): SUT {
    this._updateOptions({
      daysBeforeIssueStale: days,
      daysBeforePrStale: days
    });

    return this;
  }

  created(daysAgo: number): SUT {
    const today = new Date();
    today.setDate(today.getDate() - daysAgo);
    this._createdAt = today.toISOString();

    return this;
  }

  updated(daysAgo: number): SUT {
    const today = new Date();
    today.setDate(today.getDate() - daysAgo);
    this._updatedAt = today.toISOString();

    return this;
  }

  staleSince(daysAgo: number): SUT {
    this.updated(daysAgo);
    this._markedStaleAt = this._updatedAt;

    return this;
  }

  closeIn(days: number): SUT {
    return this._updateOptions({daysBeforeClose: days});
  }

  removeStaleWhenUpdated(): SUT {
    return this._updateOptions({removeStaleWhenUpdated: true});
  }

  commentCreated(daysAgo: number, body = 'A comment', userType = 'User'): SUT {
    const today = new Date();
    today.setDate(today.getDate() - daysAgo);
    this._comments.push({
      created_at: today.toISOString(),
      updated_at: new Date().toISOString(),
      body,
      user: {type: userType}
    });

    return this;
  }

  commentCreatedWhenMarkedStale(): SUT {
    this.commentCreated(0);
    this._comments[this._comments.length - 1].created_at = this._markedStaleAt!;

    return this;
  }

  ignorePullRequestCommentUpdates(): SUT {
    return this._updateOptions({ignorePrCommentUpdates: true});
  }

  staleOnPullRequestCommentUpdates(): SUT {
    return this._updateOptions({ignorePrCommentUpdates: false});
  }

  ignoreUpdates(): SUT {
    this._updateOptions({
      ignoreUpdates: true
    });

    return this;
  }

  staleOnUpdates(): SUT {
    this._updateOptions({
      ignoreUpdates: false
    });

    return this;
  }

  ignoreIssueUpdates(): SUT {
    this._updateOptions({
      ignoreIssueUpdates: true
    });

    return this;
  }

  staleOnIssueUpdates(): SUT {
    this._updateOptions({
      ignoreIssueUpdates: false
    });

    return this;
  }

  unsetIgnoreIssueUpdates(): SUT {
    this._updateOptions({
      ignoreIssueUpdates: undefined
    });

    return this;
  }

  ignorePullRequestUpdates(): SUT {
    this._updateOptions({
      ignorePrUpdates: true
    });

    return this;
  }

  staleOnPullRequestUpdates(): SUT {
    this._updateOptions({
      ignorePrUpdates: false
    });

    return this;
  }

  unsetIgnorePullRequestUpdates(): SUT {
    this._updateOptions({
      ignorePrUpdates: undefined
    });

    return this;
  }

  async test(): Promise<number> {
    return this._setTestIssueList()._setProcessor();
  }

  private _updateOptions(opts: Partial<IIssuesProcessorOptions>): SUT {
    this._opts = {...this._opts, ...opts};

    return this;
  }

  private _setTestIssueList(): SUT {
    this._testIssueList = [
      generateIssue(
        this._opts,
        1,
        'My first issue',
        this._updatedAt,
        this._createdAt,
        false,
        this._isPullRequest,
        this._markedStaleAt
          ? [
              this._isPullRequest
                ? this._opts.stalePrLabel
                : this._opts.staleIssueLabel
            ]
          : []
      )
    ];

    return this;
  }

  private async _setProcessor(): Promise<number> {
    this.processor = new IssuesProcessorMock(
      this._opts,
      alwaysFalseStateMock,
      async p => (p === 1 ? this._testIssueList : []),
      undefined,
      async () => this._markedStaleAt ?? new Date().toDateString()
    );

    const repo = jest.spyOn(context, 'repo', 'get').mockReturnValue({
      owner: 'owner',
      repo: 'repo'
    });
    const listComments = jest
      .spyOn(this.processor.client.rest.issues, 'listComments')
      .mockResolvedValue({data: this._comments} as Awaited<
        ReturnType<typeof this.processor.client.rest.issues.listComments>
      >);

    try {
      return await this.processor.processIssues(1);
    } finally {
      repo.mockRestore();
      listComments.mockRestore();
    }
  }
}
