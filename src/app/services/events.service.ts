/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, of } from 'rxjs';
import { CalendarEvent } from '../models/event.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly http = inject(HttpClient);
  #URL = environment.apiUrl;

  getEvents() {
    const URL = this.#URL + 'events';
    return this.http.get<CalendarEvent[]>(URL).pipe(map((res: any) => res.events));
  }

  createEvent(event: CalendarEvent) {
    const data = { ...event, id: crypto.randomUUID() };
    return of(data);
  }
  updateEvent(event: CalendarEvent) {
    return of(event);
  }

  getEventsOfCalendarByEmployee(date: Date) {
    const URL = this.#URL + 'calendar.json';
    return this.http
      .get(URL, { params: { date: date.toJSON() } })
      .pipe(map((res: any) => res.calendar));
  }
  getEventsOfCalendar(date: Date) {
    const URL = this.#URL + 'calendar.json';
    return this.http
      .get(URL, { params: { date: date.toJSON() } })
      .pipe(map((res: any) => res.calendar));
  }
  getEventsByMonth(_date: Date) {
    const URL = this.#URL + 'events.json';
    return this.http.get<CalendarEvent[]>(URL).pipe(map((res: any) => res.events));
  }
  getAllEventsByDay(date: string, typeEvent = 0) {
    const URL = this.#URL + 'events.json';
    return this.http.get<CalendarEvent[]>(URL, { params: { date, typeEvent } }).pipe(
      map((res: any) =>
        res.events.filter((event: CalendarEvent) => {
          if (event.date === date) return event;
          return false;
        }),
      ),
    );
  }

  getEventTypes() {
    const URL = this.#URL + 'event-types.json';
    return this.http.get(URL).pipe(map((res: any) => res.eventTypes));
  }
}
