/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { Record } from '../models/record.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  private readonly http = inject(HttpClient);
  #URL = environment.apiUrl;

  startWorkday(body: object) {
    const URL = this.#URL + 'records';
    return this.http.post<Record>(URL, body).pipe(
      map((res: any) => {
        return { ...res, companyId: res.company.id };
      })
    );
  }

  endWorday(recordId: number, body: object) {
    const URL = this.#URL + 'records/' + recordId;
    return this.http.patch<Record>(URL, body);
  }

  getActiveWorkdayByEmployee(employeeID: number) {
    const URL = this.#URL + 'records/is-active/' + employeeID;
    return this.http.get<Record>(URL);
  }
  getRecordsByEmployee(employeeID = 22) {
    const URL = `${this.#URL}records/by-employee/${employeeID}`;
    return this.http.get<Record[]>(URL).pipe(
      map((res: Record[]) => {
        return res;
      })
    );
  }
  getRecords() {
    const URL = this.#URL + 'records';
    return this.http.get<Record[]>(URL).pipe(
      map((res: any[]) => {
        return res.map((record: any) => ({
          ...record,
          employeeId: record.employee.id,
          employeeName: record.employee.name,
          employeeUsername: record.employee.username,
          companyId: record.company.id,
          companyName: record.company.name,
        }));
      })
    );
  }

  getRecordById(recordId: string | number) {
    const URL = this.#URL + 'records';
    return this.http
      .get<Record>(URL)
      .pipe(
        map((res: any) =>
          res.records.find((record: Record) => record.id == +recordId)
        )
      );
  }

  updateRecordIncidentByAdmin(recordId: string | number, incident: string) {
    const URL = `${this.#URL}records/admin/${recordId}`;
    return this.http.put<Record>(URL, { incidentAdmin: incident });
  }
  updateRecordsIncidentByAdmin(body: object) {
    const URL = this.#URL + 'records';
    return this.http.patch<Record>(URL, body);
  }
}
