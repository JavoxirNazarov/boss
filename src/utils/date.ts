export function startDate(): string {
  const dateObj = new Date();

  let month = dateObj.getUTCMonth() + 1 < 10
    ? '0' + (dateObj.getUTCMonth() + 1)
    : dateObj.getUTCMonth() + 1;

  let day =
    dateObj.getUTCDate() < 10
      ? '0' + dateObj.getUTCDate()
      : dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();


  let newdate = year + '-' + month + '-' + day;
  return newdate;
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
  return date.split('-').join('')
}