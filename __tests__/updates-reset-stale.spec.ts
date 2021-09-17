import {Issue} from '../src/classes/issue';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IsoDateString} from '../src/types/iso-date-string';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';

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

class SUT {
  processor!: IssuesProcessorMock;
  private _opts: IIssuesProcessorOptions = {...DefaultProcessorOptions};
  private _isPullRequest = false;
  private _createdAt: IsoDateString = '2020-01-01T17:00:00Z';
  private _updatedAt: IsoDateString = '2020-01-01T17:00:00Z';
  private _testIssueList: Issue[] = [];

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
        this._isPullRequest
      )
    ];

    return this;
  }

  private async _setProcessor(): Promise<number> {
    this.processor = new IssuesProcessorMock(
      this._opts,
      async p => (p === 1 ? this._testIssueList : []),
      async () => [],
      async () => new Date().toDateString()
    );

    return this.processor.processIssues(1);
  }
}
