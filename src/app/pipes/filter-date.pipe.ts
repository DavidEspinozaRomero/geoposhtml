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
    const inputDate = new Date(value + ':');
    const records = arr
      .filter((record) => {
        const recordYear = new Date(record.geoStart.timestamp).getFullYear();
        const inputYear = inputDate.getFullYear();
        return recordYear === inputYear;
      })
      .filter((record) => {
        const recordMonth = new Date(record.geoStart.timestamp).getMonth();
        const inputMonth = inputDate.getMonth();
        return recordMonth === inputMonth;
      })
      .filter((record) => {
        const recordDay = new Date(record.geoStart.timestamp).getDate();
        const inputDay = inputDate.getDate();
        return recordDay === inputDay;
      });

    return records;
  }
}
