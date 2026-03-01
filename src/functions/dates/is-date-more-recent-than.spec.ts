import {isDateEqualTo, isDateMoreRecentThan} from './is-date-more-recent-than';

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

  describe('date equality', (): void => {
    it('should correctly compare a before date outside tolerance', (): void => {
      const aDate = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T14:00:00');
      expect(isDateEqualTo(aDate, otherDate, 60)).toBe(false);
    });

    it('should correctly compare a before date inside tolerance', (): void => {
      const aDate = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T13:00:42');
      expect(isDateEqualTo(aDate, otherDate, 60)).toBe(true);
    });

    it('should correctly compare an after date outside tolerance', (): void => {
      const aDate = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T12:00:00');
      expect(isDateEqualTo(aDate, otherDate, 60)).toBe(false);
    });

    it('should correctly compare an after date inside tolerance', (): void => {
      const aDate = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T12:59:42');
      expect(isDateEqualTo(aDate, otherDate, 60)).toBe(true);
    });

    it('should correctly compare an exactly equal date', (): void => {
      const aDate = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T13:00:00');
      expect(isDateEqualTo(aDate, otherDate, 60)).toBe(true);
    });
  });

  describe('date comparison with tolerances', (): void => {
    it('should correctly compare a before date outside tolerance', (): void => {
      const aDate = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T14:00:00');
      expect(isDateMoreRecentThan(aDate, otherDate)).toBe(false);
    });

    it('should correctly compare a before date inside tolerance', (): void => {
      const aDate = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T13:00:42');
      expect(isDateMoreRecentThan(aDate, otherDate, 60)).toBe(false); // considered equal here
    });

    it('should correctly compare an after date outside tolerance', (): void => {
      const aDate = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T12:00:00');
      expect(isDateMoreRecentThan(aDate, otherDate, 60)).toBe(true);
    });

    it('should correctly compare an after date inside tolerance', (): void => {
      const aDate = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T12:59:42');
      expect(isDateMoreRecentThan(aDate, otherDate, 60)).toBe(false); // considered equal here
    });

    it('should correctly compare an exactly equal date', (): void => {
      const aDate = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T13:00:00');
      expect(isDateMoreRecentThan(aDate, otherDate, 60)).toBe(false);
    });
  });
});
