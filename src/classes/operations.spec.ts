import {Operations} from './operations';

describe('Operations', (): void => {
  let operations: Operations;

  describe('consumeOperation()', (): void => {
    beforeEach((): void => {
      operations = new Operations();
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
      operations = new Operations();
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
      operations = new Operations();
    });

    it('should return 0 by default', (): void => {
      expect.assertions(1);

      const result = operations.getConsumedOperationsCount();

      expect(result).toStrictEqual(0);
    });
  });
});
