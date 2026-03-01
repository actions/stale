import {isValidDate} from './is-valid-date';

describe('isValidDate()', (): void => {
  let date: Date;

  describe('when the given date is an invalid date', (): void => {
    beforeEach((): void => {
      date = new Date('16-04-1994');
    });

    it('should return false', (): void => {
      expect.assertions(1);

      const result = isValidDate(date);

      expect(result).toStrictEqual(false);
    });
  });

  describe('when the given date is a new date', (): void => {
    beforeEach((): void => {
      date = new Date();
    });

    it('should return true', (): void => {
      expect.assertions(1);

      const result = isValidDate(date);

      expect(result).toStrictEqual(true);
    });
  });

  describe('when the given date is an ISO and valid date', (): void => {
    beforeEach((): void => {
      date = new Date('2011-04-22T13:33:48Z');
    });

    it('should return true', (): void => {
      expect.assertions(1);

      const result = isValidDate(date);

      expect(result).toStrictEqual(true);
    });
  });

  describe('when the given date is an ISO with ms and valid date', (): void => {
    beforeEach((): void => {
      date = new Date('2011-10-05T14:48:00.000Z');
    });

    it('should return true', (): void => {
      expect.assertions(1);

      const result = isValidDate(date);

      expect(result).toStrictEqual(true);
    });
  });
});
