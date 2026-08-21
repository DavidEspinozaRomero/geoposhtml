/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

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
    const URL = this.#URL + 'events';
    return this.http.post<CalendarEvent>(URL, event);
  }

  updateEvent(event: CalendarEvent) {
    const URL = this.#URL + 'events/' + event.id;
    return this.http.patch<CalendarEvent>(URL, event);
  }

  deleteEvent(event: CalendarEvent) {
    const URL = this.#URL + 'events/' + event.id;
    return this.http.delete<CalendarEvent>(URL);
  }

  getEventTypes() {
    const URL = this.#URL + 'event-types';
    return this.http.get<any[]>(URL);
  }

  getEventsOfCalendarByEmployee(date: Date) {
    const URL = this.#URL + 'calendar';
    return this.http
      .get(URL, { params: { date: date.toJSON() } })
      .pipe(map((res: any) => res.calendar));
  }

  getEventsOfCalendar(date: Date) {
    const URL = this.#URL + 'calendar';
    return this.http
      .get(URL, { params: { date: date.toJSON() } })
      .pipe(map((res: any) => res.calendar));
  }

  getEventsByMonth(_date: Date) {
    const URL = this.#URL + 'events';
    return this.http.get<CalendarEvent[]>(URL).pipe(map((res: any) => res.events));
  }

  getAllEventsByDay(date: string, typeEvent = 0) {
    const URL = this.#URL + 'events/by-day';
    return this.http.get<CalendarEvent[]>(URL, { params: { date, typeEvent } });
  }
}
