import {areDatesEqual} from './date-comparison';

describe('date-comparison', (): void => {
  describe('consumeOperation()', (): void => {
    it('should correctly compare a before date outside tolerance', (): void => {
      const date = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T14:00:00');
      expect(areDatesEqual(date, otherDate, 60)).toBe(false);
    });

    it('should correctly compare a before date inside tolerance', (): void => {
      const date = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T13:00:42');
      expect(areDatesEqual(date, otherDate, 60)).toBe(true);
    });

    it('should correctly compare an after date outside tolerance', (): void => {
      const date = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T12:00:00');
      expect(areDatesEqual(date, otherDate, 60)).toBe(false);
    });

    it('should correctly compare an after date inside tolerance', (): void => {
      const date = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T12:59:42');
      expect(areDatesEqual(date, otherDate, 60)).toBe(true);
    });

    it('should correctly compare an exactly equal date', (): void => {
      const date = new Date('2022-09-09T13:00:00');
      const otherDate = new Date('2022-09-09T13:00:00');
      expect(areDatesEqual(date, otherDate, 60)).toBe(true);
    });
  });
});
