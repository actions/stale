/**
 * @description
 * Check if a date is valid
 *
 * @see
 * https://stackoverflow.com/a/1353711/4440414
 *
 * @param {Readonly<Date>} date The date to check
 *
 * @returns {boolean} true when the given date is valid
 */
export function isValidDate(date: Readonly<Date>): boolean {
  if (Object.prototype.toString.call(date) === '[object Date]') {
    return !isNaN(date.getTime());
  }

  return false;
}
