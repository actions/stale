export function shouldMarkWhenStale(
  daysBeforeStale: Readonly<number>
): boolean {
  return daysBeforeStale >= 0;
}
