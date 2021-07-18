import {updatedSince} from './updated-since';

describe('updatedSince()', (): void => {
  let timestamp: string;
  let numberOfDays: number;

  describe('when the given number of days is negative', (): void => {
    beforeEach((): void => {
      numberOfDays = -1;
    });

    describe('when the given timestamp is now', (): void => {
      beforeEach((): void => {
        timestamp = new Date().toISOString();
      });

      it('should return false', (): void => {
        expect.assertions(1);

        const result = updatedSince(timestamp, numberOfDays);

        expect(result).toStrictEqual(false);
      });
    });
  });

  describe('when the given number of days is 0', (): void => {
    beforeEach((): void => {
      numberOfDays = 0;
    });

    describe('when the given timestamp is now', (): void => {
      beforeEach((): void => {
        timestamp = new Date().toISOString();
      });

      it('should return true', (): void => {
        expect.assertions(1);

        const result = updatedSince(timestamp, numberOfDays);

        expect(result).toStrictEqual(true);
      });
    });
  });

  describe('when the given number of days is 1', (): void => {
    beforeEach((): void => {
      numberOfDays = 1;
    });

    describe('when the given timestamp is now', (): void => {
      beforeEach((): void => {
        timestamp = new Date().toISOString();
      });

      it('should return true', (): void => {
        expect.assertions(1);

        const result = updatedSince(timestamp, numberOfDays);

        expect(result).toStrictEqual(true);
      });
    });

    describe('when the given timestamp is is one day', (): void => {
      beforeEach((): void => {
        timestamp = new Date(new Date().getDate() + 1)?.toISOString();
      });

      it('should return false', (): void => {
        expect.assertions(1);

        const result = updatedSince(timestamp, numberOfDays);

        expect(result).toStrictEqual(false);
      });
    });

    describe('when the given timestamp is is two days', (): void => {
      beforeEach((): void => {
        timestamp = new Date(new Date().getDate() + 2)?.toISOString();
      });

      it('should return false', (): void => {
        expect.assertions(1);

        const result = updatedSince(timestamp, numberOfDays);

        expect(result).toStrictEqual(false);
      });
    });
  });
});
