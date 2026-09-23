import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, tap } from 'rxjs';

import { Record, PaginatedResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  private readonly http = inject(HttpClient);
  #URL = environment.apiUrl;

  startWorkday(body: object) {
    const URL = `${this.#URL}records`;
    return this.http.post<Record>(URL, body).pipe(
      map((res: Record & { company?: { id: number } }) => ({
        ...res,
        companyId: res.company?.id ?? (res as Record).companyId,
      })),
    );
  }

  endWorday(recordId: number, body: object) {
    const URL = `${this.#URL}records/${recordId}`;
    return this.http.patch<Record>(URL, body);
  }

  getActiveWorkdayByEmployee(employeeID: number) {
    const URL = `${this.#URL}records/is-active/${employeeID}`;
    return this.http.get<Record>(URL);
  }

  getRecordsByEmployee(employeeID: number) {
    const URL = `${this.#URL}records/employee/${employeeID}`;
    return this.http.get<Record[]>(URL).pipe(
      tap(console.log),
      map((res) =>
        res.map((record: any) => ({
          ...record,
          companyId: record.company?.id,
          companyName: record.company?.name,
        })),
      ),
    );
  }

  getRecords() {
    const URL = `${this.#URL}records`;
    return this.http.get<PaginatedResponse<Record>>(URL).pipe(
      map((res) =>
        res.data.map((record: any) => ({
          ...record,
          employeeId: record.employee?.id,
          employeeName: record.employee?.name,
          employeeUsername: record.employee?.username,
          companyId: record.company?.id,
          companyName: record.company?.name,
        })),
      ),
    );
  }

  getRecordById(recordId: string | number) {
    const URL = `${this.#URL}records/${recordId}`;
    return this.http.get<Record>(URL);
  }

  updateRecordIncidentByAdmin(recordId: string | number, incident: string) {
    const URL = `${this.#URL}records/admin/${recordId}`;
    return this.http.put<Record>(URL, { incidentAdmin: incident });
  }

  updateRecordsIncidentByAdmin(body: object) {
    const URL = `${this.#URL}records`;
    return this.http.patch<Record>(URL, body);
  }
}
