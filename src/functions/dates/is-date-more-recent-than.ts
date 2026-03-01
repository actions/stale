/// returns false if the dates are equal within the `equalityToleranceInSeconds` number of seconds
/// otherwise returns true if `comparedDate` is after `date`

export function isDateMoreRecentThan(
  date: Readonly<Date>,
  comparedDate: Readonly<Date>,
  equalityToleranceInSeconds = 0
): boolean {
  if (equalityToleranceInSeconds > 0) {
    const areDatesEqual = isDateEqualTo(
      date,
      comparedDate,
      equalityToleranceInSeconds
    );

    return !areDatesEqual && date > comparedDate;
  }

  return date > comparedDate;
}

export function isDateEqualTo(
  date: Date,
  otherDate: Date,
  toleranceInSeconds: number
): boolean {
  const timestamp = date.getTime();
  const otherTimestamp = otherDate.getTime();
  const deltaInSeconds = Math.abs(timestamp - otherTimestamp) / 1000;
  return deltaInSeconds <= toleranceInSeconds;
}
