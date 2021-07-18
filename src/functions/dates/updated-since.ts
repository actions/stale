export function updatedSince(
  timestamp: Readonly<string>,
  numberOfDays: Readonly<number>
): boolean {
  const daysInMillis = 1000 * 60 * 60 * 24 * numberOfDays;
  const millisSinceLastUpdated: number =
    new Date().getTime() - new Date(timestamp).getTime();

  if (isNaN(millisSinceLastUpdated)) {
    throw new Error(
      'updatedSince should have a valid timestamp to avoid NaN result'
    );
  }

  return millisSinceLastUpdated <= daysInMillis;
}
