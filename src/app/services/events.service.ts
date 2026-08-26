import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { CalendarEvent, PaginatedResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly http = inject(HttpClient);
  #URL = environment.apiUrl;

  getEvents() {
    const URL = `${this.#URL}events`;
    return this.http.get<PaginatedResponse<CalendarEvent>>(URL).pipe(map((res) => res.data));
  }

  createEvent(event: CalendarEvent) {
    const URL = `${this.#URL}events`;
    return this.http.post<CalendarEvent>(URL, event);
  }

  updateEvent(event: CalendarEvent) {
    const URL = `${this.#URL}events/${event.id}`;
    return this.http.patch<CalendarEvent>(URL, event);
  }

  deleteEvent(event: CalendarEvent) {
    const URL = `${this.#URL}events/${event.id}`;
    return this.http.delete<CalendarEvent>(URL);
  }

  getEventTypes() {
    const URL = `${this.#URL}event-types`;
    return this.http
      .get<PaginatedResponse<{ id: number; name: string }>>(URL)
      .pipe(map((res) => res.data));
  }

  getEventsOfCalendarByEmployee(date: Date) {
    const URL = `${this.#URL}events/by-employee`;
    return this.http
      .get<{ calendar: CalendarEvent[] }>(URL, { params: { date: date.toJSON() } })
      .pipe(map((res) => res.calendar));
  }

  getEventsOfCalendar(date: Date) {
    const URL = `${this.#URL}calendar`;
    return this.http
      .get<{ calendar: CalendarEvent[] }>(URL, { params: { date: date.toJSON() } })
      .pipe(map((res) => res.calendar));
  }

  getEventsByMonth(_date: Date) {
    const URL = `${this.#URL}events`;
    return this.http.get<PaginatedResponse<CalendarEvent>>(URL).pipe(map((res) => res.data));
  }

  getAllEventsByDay(date: string, typeEvent = 0) {
    const URL = `${this.#URL}events/by-day`;
    return this.http
      .get<PaginatedResponse<CalendarEvent>>(URL, { params: { date, typeEvent } })
      .pipe(map((res) => res.data));
  }
}
