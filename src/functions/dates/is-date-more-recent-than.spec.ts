import {isDateMoreRecentThan} from './is-date-more-recent-than';

describe('isDateMoreRecentThan()', (): void => {
  let date: Date;
  let comparedDate: Date;

  describe('when the given date is older than the compared date', (): void => {
    beforeEach((): void => {
      date = new Date(2020, 0, 20);
      comparedDate = new Date(2021, 0, 20);
    });

    it('should return false', (): void => {
      expect.assertions(1);

      const result = isDateMoreRecentThan(date, comparedDate);

      expect(result).toStrictEqual(false);
    });
  });

  describe('when the given date is equal to the compared date', (): void => {
    beforeEach((): void => {
      date = new Date(2020, 0, 20);
      comparedDate = new Date(2020, 0, 20);
    });

    it('should return false', (): void => {
      expect.assertions(1);

      const result = isDateMoreRecentThan(date, comparedDate);

      expect(result).toStrictEqual(false);
    });
  });

  describe('when the given date is more recent than the compared date', (): void => {
    beforeEach((): void => {
      date = new Date(2021, 0, 20);
      comparedDate = new Date(2020, 0, 20);
    });

    it('should return true', (): void => {
      expect.assertions(1);

      const result = isDateMoreRecentThan(date, comparedDate);

      expect(result).toStrictEqual(true);
    });
  });
});
