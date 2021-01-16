export function isDateMoreRecentThan(
  date: Readonly<Date>,
  comparedDate: Readonly<Date>
): boolean {
  return date > comparedDate;
}
