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
    const [year, month, day] = value.split('-').map(Number);
    const inputDate = new Date(year, month - 1, day);
    const records = arr.filter((record) => {
      const recordDate = new Date(+record.geoStart.timestamp);
      return (
        recordDate.getFullYear() === inputDate.getFullYear() &&
        recordDate.getMonth() === inputDate.getMonth() &&
        recordDate.getDate() === inputDate.getDate()
      );
    });

    return records;
  }
}
