const DAY = 1000 * 60 * 60 * 24;

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
}

function countWeekdaysBetweenDates(start: Date, end: Date, weekdays: number[]) {
  const totalDays = Math.floor((end.getTime() - start.getTime()) / DAY);
  const startDayOfWeek = start.getDay();
  const weekdaysMap = new Set(weekdays);

  let count = 0;
  for (let i = 0; i < totalDays; i++) {
    const currentDay = (startDayOfWeek + i) % 7;
    if (weekdaysMap.has(currentDay)) {
      count++;
    }
  }

  return count;
}

export const elapsedMillisExcludingDays = (
  from: Date,
  to: Date,
  excludeWeekdays: number[]
): number => {
  let elapsedMillis = to.getTime() - from.getTime();

  if (excludeWeekdays.length > 0) {
    const startOfNextDayFrom = startOfDay(new Date(from.getTime() + DAY));
    const startOfDayTo = startOfDay(to);

    if (excludeWeekdays.includes(from.getDay())) {
      elapsedMillis -= startOfNextDayFrom.getTime() - from.getTime();
    }

    if (excludeWeekdays.includes(to.getDay())) {
      elapsedMillis -= to.getTime() - startOfDayTo.getTime();
    }

    const excludeWeekdaysCount = countWeekdaysBetweenDates(
      startOfNextDayFrom,
      startOfDayTo,
      excludeWeekdays
    );

    elapsedMillis -= excludeWeekdaysCount * DAY;
  }

  return elapsedMillis;
};
