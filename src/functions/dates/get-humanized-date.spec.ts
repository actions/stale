import {getHumanizedDate} from './get-humanized-date';

describe('getHumanizedDate()', (): void => {
  let date: Date;

  describe('when the given date is the 1st of april 2020', (): void => {
    beforeEach((): void => {
      date = new Date(2020, 3, 1);
    });

    it('should return the date formatted as DD-MM-YYYY', (): void => {
      expect.assertions(1);

      const result = getHumanizedDate(date);

      expect(result).toStrictEqual('01-04-2020');
    });
  });

  describe('when the given date is the 18st of december 2020', (): void => {
    beforeEach((): void => {
      date = new Date(2020, 11, 18);
    });

    it('should return the date formatted as DD-MM-YYYY', (): void => {
      expect.assertions(1);

      const result = getHumanizedDate(date);

      expect(result).toStrictEqual('18-12-2020');
    });
  });
});
