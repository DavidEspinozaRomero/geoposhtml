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
    // const inputDate = new Date(value + ':');
    return arr.filter((event) => {
      const eventDate = new Date(event.date + ':').toJSON().slice(0, 10);
      if (eventDate === value) return true;
      return false;
      // const eventYear = eventDate.getFullYear();
      // const inputYear = inputDate.getFullYear();
      // const eventMonth = eventDate.getMonth();
      // const inputMonth = inputDate.getMonth();
      // const eventDay = eventDate.getDate();
      // const inputDay = inputDate.getDate();
      // if (
      //   eventYear === inputYear &&
      //   eventMonth === inputMonth &&
      //   eventDay === inputDay
      // )
    });
  }
}
