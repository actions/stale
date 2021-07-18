export function updatedSince(
  timestamp: Readonly<string>,
  numberOfDays: Readonly<number>
): boolean {
  const daysInMillis = 1000 * 60 * 60 * 24 * numberOfDays;
  const millisSinceLastUpdated =
    new Date().getTime() - new Date(timestamp).getTime();

  return millisSinceLastUpdated <= daysInMillis;
}
