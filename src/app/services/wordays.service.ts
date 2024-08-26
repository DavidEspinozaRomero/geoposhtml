import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { environment } from '../../environments/environment';
import { Workday, WorkdaysResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class WordaysService {
  private readonly http = inject(HttpClient);
  #apiUrl = environment.apiUrl;
  constructor() {}

  getWordaysByEmployee(employeeID: number) {
    const URL = this.#apiUrl + 'workdays/by-employee/' + employeeID;
    return this.http.get<WorkdaysResponse[]>(URL).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  createWorkdaysByEmployee(json: {}) {
    const URL = this.#apiUrl + 'workdays/by-employee';
    return this.http.post<Workday>(URL, json);
  }

  deleteWorday(workdayID: string) {
    const URL = this.#apiUrl + 'workdays/' + workdayID;
    return this.http.delete<Workday>(URL).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
