import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { Workday, WorkdaysResponse, PaginatedResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WordaysService {
  private readonly http = inject(HttpClient);
  #apiUrl = environment.apiUrl;

  getWordaysByEmployee(employeeID: number) {
    const URL = `${this.#apiUrl}workdays/by-employee/${employeeID}`;
    return this.http.get<PaginatedResponse<WorkdaysResponse>>(URL).pipe(map((res) => res.data));
  }

  createWorkdaysByEmployee(json: Record<string, unknown>) {
    const URL = `${this.#apiUrl}workdays/by-employee`;
    return this.http.post<Workday>(URL, json);
  }

  deleteWorday(workdayID: string) {
    const URL = `${this.#apiUrl}workdays/${workdayID}`;
    return this.http.delete<Workday>(URL);
  }
}
