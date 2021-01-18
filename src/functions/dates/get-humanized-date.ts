import {HumanizedDate} from '../../types/humanized-date';

export function getHumanizedDate(date: Readonly<Date>): HumanizedDate {
  const year: number = date.getFullYear();
  let month = `${date.getMonth() + 1}`;
  let day = `${date.getDate()}`;

  if (month.length < 2) {
    month = `0${month}`;
  }

  if (day.length < 2) {
    day = `0${day}`;
  }

  return [day, month, year].join('-');
}
