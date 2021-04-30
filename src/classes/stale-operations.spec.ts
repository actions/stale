import {DefaultProcessorOptions} from '../../__tests__/constants/default-processor-options';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {StaleOperations} from './stale-operations';

interface IHasRemainingOperationsMatrix {
  operationsPerRun: number;
  consumeOperations: number;
  hasRemainingOperations: number;
}

interface IGetRemainingOperationsCountMatrix {
  operationsPerRun: number;
  consumeOperations: number;
  getRemainingOperationsCount: number;
}

describe('StaleOperations', (): void => {
  let operations: StaleOperations;
  let options: IIssuesProcessorOptions;

  beforeEach((): void => {
    options = {...DefaultProcessorOptions};
  });

  describe('consumeOperation()', (): void => {
    beforeEach((): void => {
      operations = new StaleOperations(options);
    });

    it('should increase the count of operation consume by 1', (): void => {
      expect.assertions(1);
      operations.consumeOperation();

      const result = operations.getConsumedOperationsCount();

      expect(result).toStrictEqual(1);
    });
  });

  describe('consumeOperations()', (): void => {
    beforeEach((): void => {
      operations = new StaleOperations(options);
    });

    it('should increase the count of operation consume by the provided quantity', (): void => {
      expect.assertions(1);
      operations.consumeOperations(8);

      const result = operations.getConsumedOperationsCount();

      expect(result).toStrictEqual(8);
    });
  });

  describe('getConsumedOperationsCount()', (): void => {
    beforeEach((): void => {
      operations = new StaleOperations(options);
    });

    it('should return 0 by default', (): void => {
      expect.assertions(1);

      const result = operations.getConsumedOperationsCount();

      expect(result).toStrictEqual(0);
    });
  });

  describe('hasRemainingOperations()', (): void => {
    beforeEach((): void => {
      operations = new StaleOperations(options);
    });

    describe.each`
      operationsPerRun | consumeOperations | hasRemainingOperations
      ${1}             | ${1}              | ${false}
      ${2}             | ${1}              | ${true}
    `(
      'when the operations per run is $operationsPerRun and $consumeOperations operations were consumed',
      ({
        operationsPerRun,
        consumeOperations,
        hasRemainingOperations
      }: IHasRemainingOperationsMatrix): void => {
        beforeEach((): void => {
          options.operationsPerRun = operationsPerRun;
          operations = new StaleOperations(options);
        });

        it(`should return ${hasRemainingOperations}`, (): void => {
          expect.assertions(1);
          operations.consumeOperations(consumeOperations);

          const result = operations.hasRemainingOperations();

          expect(result).toStrictEqual(hasRemainingOperations);
        });
      }
    );
  });

  describe('getRemainingOperationsCount()', (): void => {
    beforeEach((): void => {
      operations = new StaleOperations(options);
    });

    describe.each`
      operationsPerRun | consumeOperations | getRemainingOperationsCount
      ${1}             | ${1}              | ${0}
      ${2}             | ${1}              | ${1}
    `(
      'when the operations per run is $operationsPerRun and $consumeOperations operations were consumed',
      ({
        operationsPerRun,
        consumeOperations,
        getRemainingOperationsCount
      }: IGetRemainingOperationsCountMatrix): void => {
        beforeEach((): void => {
          options.operationsPerRun = operationsPerRun;
          operations = new StaleOperations(options);
        });

        it(`should return ${getRemainingOperationsCount}`, (): void => {
          expect.assertions(1);
          operations.consumeOperations(consumeOperations);

          const result = operations.getRemainingOperationsCount();

          expect(result).toStrictEqual(getRemainingOperationsCount);
        });
      }
    );
  });
});
