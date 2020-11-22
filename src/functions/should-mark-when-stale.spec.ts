import {shouldMarkWhenStale} from './should-mark-when-stale';

describe('shouldMarkWhenStale()', (): void => {
  let daysBeforeStale: number;

  describe('when the given number of days indicate that it should be stalled', (): void => {
    beforeEach((): void => {
      daysBeforeStale = -1;
    });

    it('should return false', (): void => {
      expect.assertions(1);

      const result = shouldMarkWhenStale(daysBeforeStale);

      expect(result).toStrictEqual(false);
    });
  });

  describe('when the given number of days indicate that it should be stalled today', (): void => {
    beforeEach((): void => {
      daysBeforeStale = 0;
    });

    it('should return true', (): void => {
      expect.assertions(1);

      const result = shouldMarkWhenStale(daysBeforeStale);

      expect(result).toStrictEqual(true);
    });
  });

  describe('when the given number of days indicate that it should be stalled tomorrow', (): void => {
    beforeEach((): void => {
      daysBeforeStale = 1;
    });

    it('should return true', (): void => {
      expect.assertions(1);

      const result = shouldMarkWhenStale(daysBeforeStale);

      expect(result).toStrictEqual(true);
    });
  });
});
