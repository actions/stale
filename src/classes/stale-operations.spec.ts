import {DefaultProcessorOptions} from '../../__tests__/constants/default-processor-options';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {StaleOperations} from './stale-operations';

interface IHasOperationsLeftMatrix {
  operationsPerRun: number;
  consumeOperations: number;
  hasOperationsLeft: number;
}

interface IGetOperationsLeftCountMatrix {
  operationsPerRun: number;
  consumeOperations: number;
  getOperationsLeftCount: number;
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

  describe('hasOperationsLeft()', (): void => {
    beforeEach((): void => {
      operations = new StaleOperations(options);
    });

    describe.each`
      operationsPerRun | consumeOperations | hasOperationsLeft
      ${1}             | ${1}              | ${false}
      ${2}             | ${1}              | ${true}
    `(
      'when the operations per run is $operationsPerRun and $consumeOperations operations were consumed',
      ({
        operationsPerRun,
        consumeOperations,
        hasOperationsLeft
      }: IHasOperationsLeftMatrix): void => {
        beforeEach((): void => {
          options.operationsPerRun = operationsPerRun;
          operations = new StaleOperations(options);
        });

        it(`should return ${hasOperationsLeft}`, (): void => {
          expect.assertions(1);
          operations.consumeOperations(consumeOperations);

          const result = operations.hasOperationsLeft();

          expect(result).toStrictEqual(hasOperationsLeft);
        });
      }
    );
  });

  describe('getOperationsLeftCount()', (): void => {
    beforeEach((): void => {
      operations = new StaleOperations(options);
    });

    describe.each`
      operationsPerRun | consumeOperations | getOperationsLeftCount
      ${1}             | ${1}              | ${0}
      ${2}             | ${1}              | ${1}
    `(
      'when the operations per run is $operationsPerRun and $consumeOperations operations were consumed',
      ({
        operationsPerRun,
        consumeOperations,
        getOperationsLeftCount
      }: IGetOperationsLeftCountMatrix): void => {
        beforeEach((): void => {
          options.operationsPerRun = operationsPerRun;
          operations = new StaleOperations(options);
        });

        it(`should return ${getOperationsLeftCount}`, (): void => {
          expect.assertions(1);
          operations.consumeOperations(consumeOperations);

          const result = operations.getOperationsLeftCount();

          expect(result).toStrictEqual(getOperationsLeftCount);
        });
      }
    );
  });
});
