import {elapsedMillisExcludingDays} from './elapsed-millis-excluding-days';

describe('elapsedMillisExcludingDays', () => {
  const HOUR = 1000 * 60 * 60;
  const DAY = HOUR * 24;

  it('calculates elapsed days when no weekdays are excluded', () => {
    const from = new Date();
    const lessThan = new Date(from.getTime() - 1);
    const equal = from;
    const greaterThan = new Date(from.getTime() + 1);

    expect(elapsedMillisExcludingDays(from, lessThan, [])).toEqual(-1);
    expect(elapsedMillisExcludingDays(from, equal, [])).toEqual(0);
    expect(elapsedMillisExcludingDays(from, greaterThan, [])).toEqual(1);
  });

  it('calculates elapsed days with specified weekdays excluded', () => {
    const date = new Date('2025-03-03 09:00:00'); // Monday

    const tomorrow = new Date('2025-03-04 09:00:00');
    expect(elapsedMillisExcludingDays(date, tomorrow, [])).toEqual(DAY);
    expect(elapsedMillisExcludingDays(date, tomorrow, [1])).toEqual(9 * HOUR);

    const dayAfterTomorrow = new Date('2025-03-05 10:00:00');
    const full = 2 * DAY + HOUR;
    expect(elapsedMillisExcludingDays(date, dayAfterTomorrow, [])).toEqual(
      full
    );
    expect(elapsedMillisExcludingDays(date, dayAfterTomorrow, [0])).toEqual(
      full
    );
    expect(elapsedMillisExcludingDays(date, dayAfterTomorrow, [1])).toEqual(
      full - 15 * HOUR
    );
    expect(elapsedMillisExcludingDays(date, dayAfterTomorrow, [2])).toEqual(
      full - DAY
    );
    expect(elapsedMillisExcludingDays(date, dayAfterTomorrow, [3])).toEqual(
      full - 10 * HOUR
    );
    expect(elapsedMillisExcludingDays(date, dayAfterTomorrow, [4])).toEqual(
      full
    );
    expect(elapsedMillisExcludingDays(date, dayAfterTomorrow, [1, 2])).toEqual(
      10 * HOUR
    );
    expect(elapsedMillisExcludingDays(date, dayAfterTomorrow, [2, 3])).toEqual(
      15 * HOUR
    );
  });

  it('handles week spanning periods correctly', () => {
    const friday = new Date('2025-03-07 09:00:00');
    const nextMonday = new Date('2025-03-10 09:00:00');
    expect(elapsedMillisExcludingDays(friday, nextMonday, [0, 6])).toEqual(DAY);
  });

  it('handles long periods with multiple weeks', () => {
    const start = new Date('2025-03-03 09:00:00');
    const twoWeeksLater = new Date('2025-03-17 09:00:00');
    expect(elapsedMillisExcludingDays(start, twoWeeksLater, [0, 6])).toEqual(
      10 * DAY
    );

    const lessThanTwoWeeksLater = new Date('2025-03-17 08:59:59');
    expect(
      elapsedMillisExcludingDays(start, lessThanTwoWeeksLater, [0, 6])
    ).toEqual(10 * DAY - 1000);
  });
});
