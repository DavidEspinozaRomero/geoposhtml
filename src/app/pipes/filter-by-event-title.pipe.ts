import { Pipe, PipeTransform } from '@angular/core';
import { CalendarEvent } from '../models';

@Pipe({
  name: 'filterByEventTitle',
  standalone: true,
})
export class FilterByEventTitlePipe implements PipeTransform {
  transform(arr: CalendarEvent[], value: string): CalendarEvent[] {
    if (!arr.length) return arr;
    if (!value) return arr;
    return arr.filter((event) =>
      event.title.toLowerCase().includes(value.toLowerCase())
    );
  }
}
