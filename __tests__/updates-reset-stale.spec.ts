import {Issue} from '../src/classes/issue';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IsoDateString} from '../src/types/iso-date-string';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';

describe('updates reset stale options', (): void => {
  let sut: SUT;

  beforeEach((): void => {
    sut = new SUT();
  });

  describe('when the issue should be stale within 10 days and was created 20 days ago and updated 5 days ago', (): void => {
    beforeEach((): void => {
      sut.toIssue().staleIn(10).created(20).updated(5);
    });

    describe('when the updates reset stale option is disabled', (): void => {
      beforeEach((): void => {
        sut.staleIgnoresUpdates();
      });

      it('should stale the issue', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the issue updates reset stale option is enabled', (): void => {
        beforeEach((): void => {
          sut.issueUpdatesResetStale();
        });

        it('should not stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(0);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the issue updates reset stale option is disabled', (): void => {
        beforeEach((): void => {
          sut.issueStaleIgnoresUpdates();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the issue updates reset stale option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetIssueUpdatesResetStale();
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

    describe('when the updates reset stale option is enabled', (): void => {
      beforeEach((): void => {
        sut.updatesResetStale();
      });

      it('should not stale the issue', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(0);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the issue updates reset stale option is enabled', (): void => {
        beforeEach((): void => {
          sut.issueUpdatesResetStale();
        });

        it('should not stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(0);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the issue updates reset stale option is disabled', (): void => {
        beforeEach((): void => {
          sut.issueStaleIgnoresUpdates();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the issue updates reset stale option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetIssueUpdatesResetStale();
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
  });

  describe('when the issue should be stale within 10 days and was created 20 days ago and updated 15 days ago', (): void => {
    beforeEach((): void => {
      sut.toIssue().staleIn(10).created(20).updated(15);
    });

    describe('when the updates reset stale option is disabled', (): void => {
      beforeEach((): void => {
        sut.staleIgnoresUpdates();
      });

      it('should stale the issue', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the issue updates reset stale option is enabled', (): void => {
        beforeEach((): void => {
          sut.issueUpdatesResetStale();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the issue updates reset stale option is disabled', (): void => {
        beforeEach((): void => {
          sut.issueStaleIgnoresUpdates();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the issue updates reset stale option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetIssueUpdatesResetStale();
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

    describe('when the updates reset stale option is enabled', (): void => {
      beforeEach((): void => {
        sut.updatesResetStale();
      });

      it('should stale the issue', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the issue updates reset stale option is enabled', (): void => {
        beforeEach((): void => {
          sut.issueUpdatesResetStale();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the issue updates reset stale option is disabled', (): void => {
        beforeEach((): void => {
          sut.issueStaleIgnoresUpdates();
        });

        it('should stale the issue', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the issue updates reset stale option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetIssueUpdatesResetStale();
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

    describe('when the updates reset stale option is disabled', (): void => {
      beforeEach((): void => {
        sut.staleIgnoresUpdates();
      });

      it('should stale the pull request', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the pull request updates reset stale option is enabled', (): void => {
        beforeEach((): void => {
          sut.pullRequestUpdatesResetStale();
        });

        it('should not stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(0);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the pull request updates reset stale option is disabled', (): void => {
        beforeEach((): void => {
          sut.pullRequestStaleIgnoresUpdates();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the pull request updates reset stale option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetPullRequestUpdatesResetStale();
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

    describe('when the updates reset stale option is enabled', (): void => {
      beforeEach((): void => {
        sut.updatesResetStale();
      });

      it('should not stale the pull request', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(0);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the pull request updates reset stale option is enabled', (): void => {
        beforeEach((): void => {
          sut.pullRequestUpdatesResetStale();
        });

        it('should not stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(0);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the pull request updates reset stale option is disabled', (): void => {
        beforeEach((): void => {
          sut.pullRequestStaleIgnoresUpdates();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the pull request updates reset stale option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetPullRequestUpdatesResetStale();
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
  });

  describe('when the pull request should be stale within 10 days and was created 20 days ago and updated 15 days ago', (): void => {
    beforeEach((): void => {
      sut.toPullRequest().staleIn(10).created(20).updated(15);
    });

    describe('when the updates reset stale option is disabled', (): void => {
      beforeEach((): void => {
        sut.staleIgnoresUpdates();
      });

      it('should stale the pull request', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the pull request updates reset stale option is enabled', (): void => {
        beforeEach((): void => {
          sut.pullRequestUpdatesResetStale();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the pull request updates reset stale option is disabled', (): void => {
        beforeEach((): void => {
          sut.pullRequestStaleIgnoresUpdates();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the pull request updates reset stale option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetPullRequestUpdatesResetStale();
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

    describe('when the updates reset stale option is enabled', (): void => {
      beforeEach((): void => {
        sut.updatesResetStale();
      });

      it('should stale the pull request', async () => {
        expect.assertions(3);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(sut.processor.closedIssues).toHaveLength(0);
        expect(sut.processor.removedLabelIssues).toHaveLength(0);
      });

      describe('when the pull request updates reset stale option is enabled', (): void => {
        beforeEach((): void => {
          sut.pullRequestUpdatesResetStale();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the pull request updates reset stale option is disabled', (): void => {
        beforeEach((): void => {
          sut.pullRequestStaleIgnoresUpdates();
        });

        it('should stale the pull request', async () => {
          expect.assertions(3);

          await sut.test();

          expect(sut.processor.staleIssues).toHaveLength(1);
          expect(sut.processor.closedIssues).toHaveLength(0);
          expect(sut.processor.removedLabelIssues).toHaveLength(0);
        });
      });

      describe('when the pull request updates reset stale option is unset', (): void => {
        beforeEach((): void => {
          sut.unsetPullRequestUpdatesResetStale();
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

  updatesResetStale(): SUT {
    this._updateOptions({
      updatesResetStale: true
    });

    return this;
  }

  staleIgnoresUpdates(): SUT {
    this._updateOptions({
      updatesResetStale: false
    });

    return this;
  }

  issueUpdatesResetStale(): SUT {
    this._updateOptions({
      issueUpdatesResetStale: true
    });

    return this;
  }

  issueStaleIgnoresUpdates(): SUT {
    this._updateOptions({
      issueUpdatesResetStale: false
    });

    return this;
  }

  unsetIssueUpdatesResetStale(): SUT {
    this._updateOptions({
      issueUpdatesResetStale: undefined
    });

    return this;
  }

  pullRequestUpdatesResetStale(): SUT {
    this._updateOptions({
      prUpdatesResetStale: true
    });

    return this;
  }

  pullRequestStaleIgnoresUpdates(): SUT {
    this._updateOptions({
      prUpdatesResetStale: false
    });

    return this;
  }

  unsetPullRequestUpdatesResetStale(): SUT {
    this._updateOptions({
      prUpdatesResetStale: undefined
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
      async () => 'abot',
      async p => (p === 1 ? this._testIssueList : []),
      async () => [],
      async () => new Date().toDateString()
    );

    return this.processor.processIssues(1);
  }
}