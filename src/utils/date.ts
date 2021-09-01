import moment from 'moment';

export function startDate(): string {
  return moment().format('YYYY-MM-DD');
}

export function convertDate(date: string): string {
  let dateArr = date.split('-');
  let result = '';

  result += dateArr[2];
  result += ` ${[
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август ',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ][Number(dateArr[1]) == 0 ? 11 : Number(dateArr[1]) - 1]
    }`;
  result += ' ' + dateArr[0];

  return result;
}

export function formatDate(date: string) {
  return moment(date, 'YYYY-MM-DD').format('YYYYMMDD');
}
