import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, filter, of } from 'rxjs';
import { CalendarEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly http = inject(HttpClient);
  #dirData = '../../assets/data/';
  constructor() {}

  getEvents() {
    const URL = this.#dirData + 'events.json';
    return this.http
      .get<CalendarEvent[]>(URL)
      .pipe(map((res: any) => res.events));
  }

  createEvent(event: CalendarEvent) {
    const data = { ...event, id: crypto.randomUUID() };
    return of(data);
  }
  updateEvent(event: CalendarEvent) {
    return of(event);
  }

  getEventsOfCalendarByEmployee(date: Date) {
    const URL = this.#dirData + 'calendar.json';
    return this.http
      .get(URL, { params: { date: date.toJSON() } })
      .pipe(map((res: any) => res.calendar));
  }
  getEventsOfCalendar(date: Date) {
    const URL = this.#dirData + 'calendar.json';
    return this.http
      .get(URL, { params: { date: date.toJSON() } })
      .pipe(map((res: any) => res.calendar));
  }
  getEventsByMonth(date: Date) {
    const URL = this.#dirData + 'events.json';
    return this.http
      .get<CalendarEvent[]>(URL)
      .pipe(map((res: any) => res.events));
  }
  getAllEventsByDay(date: string, typeEvent: number = 0) {
    const URL = this.#dirData + 'events.json';
    return this.http
      .get<CalendarEvent[]>(URL, { params: { date, typeEvent } })
      .pipe(
        map((res: any) =>
          res.events.filter((event: CalendarEvent) => {
            if (event.date === date) return event;
            return false;
          })
        )
      );
  }

  getEventTypes() {
    const URL = this.#dirData + 'event-types.json';
    return this.http.get(URL).pipe(map((res: any) => res.eventTypes));
  }
}

// console.log(asdf.toDateString());
// console.log(asdf.toISOString());
// console.log(asdf.toJSON());
// console.log(asdf.toLocaleDateString());
// console.log(asdf.toLocaleString());
// console.log(asdf.toLocaleTimeString());
// console.log(asdf.toString());
// console.log(asdf.toTimeString());
// console.log(asdf.toUTCString());
