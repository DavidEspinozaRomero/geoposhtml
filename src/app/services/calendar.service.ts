import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { CalendarMonthTeamResponse, CalendarMonthEmployeeResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly http = inject(HttpClient);
  #URL = environment.apiUrl;

  getMonth(month: string) {
    const URL = `${this.#URL}calendar/month`;
    return this.http.get<CalendarMonthTeamResponse>(URL, { params: { month } });
  }

  getMonthByEmployee(month: string, employeeId: number) {
    const URL = `${this.#URL}calendar/month`;
    return this.http.get<CalendarMonthEmployeeResponse>(URL, {
      params: { month, employeeId },
    });
  }
}
