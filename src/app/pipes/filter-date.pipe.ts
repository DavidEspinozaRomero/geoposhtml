import { Pipe, PipeTransform } from '@angular/core';
import { Record } from '../models';

@Pipe({
  name: 'filterDate',
  standalone: true,
})
export class FilterDatePipe implements PipeTransform {
  transform(arr: Record[], value: string): Record[] {
    if (!arr.length) return arr;
    if (!value) return arr;
    const inputDate = new Date(value);
    let records = arr
      .filter((record) => {
        const recordYear = new Date(record.startTimestamp).getFullYear();
        const inputYear = inputDate.getFullYear();
        console.log(recordYear, inputYear);

        return recordYear === inputYear;
      })
      .filter((record) => {
        const recordMonth = new Date(record.startTimestamp).getMonth();
        const inputMonth = inputDate.getMonth();
        console.log(recordMonth, inputMonth);

        return recordMonth === inputMonth;
      })
      .filter((record) => {
        const recordDay = new Date(record.startTimestamp).getDate();
        const inputDay = inputDate.getDate();
        console.log(recordDay, inputDay);

        return recordDay === inputDay;
      });

    return records;
  }
}
