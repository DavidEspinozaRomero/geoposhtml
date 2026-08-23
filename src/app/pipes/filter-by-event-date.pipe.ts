import { Pipe, PipeTransform } from '@angular/core';
import { CalendarEvent } from '../models';

@Pipe({
  name: 'filterByEventDate',
  standalone: true,
})
export class FilterByEventDatePipe implements PipeTransform {
  transform(arr: CalendarEvent[], value: string): CalendarEvent[] {
    if (!arr.length) return arr;
    if (!value) return arr;
    return arr.filter((event) => event.date === value);
  }
}
