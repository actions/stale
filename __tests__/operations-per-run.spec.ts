import {Issue} from '../src/classes/issue';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IsoDateString} from '../src/types/iso-date-string';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';

describe('operations-per-run option', (): void => {
  let sut: SUT;

  beforeEach((): void => {
    sut = new SUT();
  });

  describe('when one issue should be stale within 10 days and updated 20 days ago', (): void => {
    beforeEach((): void => {
      sut.staleIn(10).newIssue().updated(20);
    });

    describe('when the operations per run option is set to 1', (): void => {
      beforeEach((): void => {
        sut.operationsPerRun(1);
      });

      it('should consume 1 operation (stale label)', async () => {
        expect.assertions(2);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(
          sut.processor.operations.getConsumedOperationsCount()
        ).toStrictEqual(1);
      });
    });
  });

  describe('when one issue should be stale within 10 days and updated 20 days ago and a comment should be added when stale', (): void => {
    beforeEach((): void => {
      sut.staleIn(10).commentOnStale().newIssue().updated(20);
    });

    describe('when the operations per run option is set to 2', (): void => {
      beforeEach((): void => {
        sut.operationsPerRun(2);
      });

      it('should consume 2 operations (stale label, comment)', async () => {
        expect.assertions(2);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(
          sut.processor.operations.getConsumedOperationsCount()
        ).toStrictEqual(2);
      });
    });

    // Special case were we continue the issue processing even if the operations per run is reached
    describe('when the operations per run option is set to 1', (): void => {
      beforeEach((): void => {
        sut.operationsPerRun(1);
      });

      it('should consume 2 operations (stale label, comment)', async () => {
        expect.assertions(2);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(
          sut.processor.operations.getConsumedOperationsCount()
        ).toStrictEqual(2);
      });
    });
  });

  describe('when two issues should be stale within 10 days and updated 20 days ago and a comment should be added when stale', (): void => {
    beforeEach((): void => {
      sut.staleIn(10).commentOnStale();
      sut.newIssue().updated(20);
      sut.newIssue().updated(20);
    });

    describe('when the operations per run option is set to 3', (): void => {
      beforeEach((): void => {
        sut.operationsPerRun(3);
      });

      it('should consume 4 operations (stale label, comment)', async () => {
        expect.assertions(2);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(2);
        expect(
          sut.processor.operations.getConsumedOperationsCount()
        ).toStrictEqual(4);
      });
    });

    describe('when the operations per run option is set to 2', (): void => {
      beforeEach((): void => {
        sut.operationsPerRun(2);
      });

      it('should consume 2 operations (stale label, comment) and stop', async () => {
        expect.assertions(2);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(
          sut.processor.operations.getConsumedOperationsCount()
        ).toStrictEqual(2);
      });
    });

    // Special case were we continue the issue processing even if the operations per run is reached
    describe('when the operations per run option is set to 1', (): void => {
      beforeEach((): void => {
        sut.operationsPerRun(1);
      });

      it('should consume 2 operations (stale label, comment) and stop', async () => {
        expect.assertions(2);

        await sut.test();

        expect(sut.processor.staleIssues).toHaveLength(1);
        expect(
          sut.processor.operations.getConsumedOperationsCount()
        ).toStrictEqual(2);
      });
    });
  });
});

class SUT {
  processor!: IssuesProcessorMock;
  private _opts: IIssuesProcessorOptions = {
    ...DefaultProcessorOptions,
    staleIssueMessage: ''
  };
  private _testIssueList: Issue[] = [];
  private _sutIssues: SUTIssue[] = [];

  newIssue(): SUTIssue {
    const sutIssue: SUTIssue = new SUTIssue();
    this._sutIssues.push(sutIssue);

    return sutIssue;
  }

  staleIn(days: number): SUT {
    this._updateOptions({
      daysBeforeIssueStale: days
    });

    return this;
  }

  commentOnStale(): SUT {
    this._updateOptions({
      staleIssueMessage: 'Dummy stale issue message'
    });

    return this;
  }

  operationsPerRun(count: number): SUT {
    this._updateOptions({
      operationsPerRun: count
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
    this._testIssueList = this._sutIssues.map((sutIssue: SUTIssue): Issue => {
      return generateIssue(
        this._opts,
        1,
        'My first issue',
        sutIssue.updatedAt,
        sutIssue.updatedAt,
        false
      );
    });

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

class SUTIssue {
  updatedAt: IsoDateString = '2020-01-01T17:00:00Z';

  updated(daysAgo: number): SUTIssue {
    const today = new Date();
    today.setDate(today.getDate() - daysAgo);
    this.updatedAt = today.toISOString();

    return this;
  }
}
