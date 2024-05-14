import { Pipe, PipeTransform } from '@angular/core';
import { CalendarEvent } from '../models';

@Pipe({
  name: 'filterByEventType',
  standalone: true,
})
export class FilterByEventTypePipe implements PipeTransform {
  transform(arr: CalendarEvent[], value: string): CalendarEvent[] {
    if (!arr.length) return arr;
    if (!value) return arr;
    return arr.filter((event) => event.typeId === +value);
  }
}
