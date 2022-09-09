export function areDatesEqual(
  date: Date,
  otherDate: Date,
  toleranceInSeconds: number
): boolean {
  const timestamp = date.getTime();
  const otherTimestamp = otherDate.getTime();
  const deltaInSeconds = Math.abs(timestamp - otherTimestamp) / 1000;
  return deltaInSeconds <= toleranceInSeconds;
}
