import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, of } from 'rxjs';

import { Record } from '../models/record.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  private readonly http = inject(HttpClient);
  #URL = environment.apiUrl;
  constructor() {}

  startWorkday(body: {}) {
    const URL = this.#URL + 'records';
    return this.http.post<Record>(URL, body).pipe(
      map((res: any) => {
        return { ...res, companyId: res.company.id };
      })
    );
  }

  endWorday(recordId: number, body: {}) {
    const URL = this.#URL + 'records/' + recordId;
    return this.http.patch<Record>(URL, body);
  }

  getActiveWorkdayByEmployee(employeeID: number) {
    const URL = this.#URL + 'records/is-active/' + employeeID;
    return this.http.get<Record>(URL);
  }
  getRecordsByEmployee(employeeID: number = 22) {
    // agregar parametros para paginacion
    // const params = `?offset=0&limit=10&date=2022-01-01&byCompany=true`;
    const URL = `${this.#URL}records/by-employee/${employeeID}`;
    return this.http.get<Record[]>(URL).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getRecords() {
    // agregar parametros para paginacion
    // const params = `?offset=0&limit=10&date=2022-01-01&byCompany=true`;
    const URL = this.#URL + 'records';
    return this.http.get<Record[]>(URL).pipe(
      map((res: any) => {
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
  updateRecordsIncidentByAdmin(body: {}) {
    // agregar parametros para actualizar registros
    // const params = `?offset=0&limit=10&date=2022-01-01&byCompany=true`;
    const URL = this.#URL + 'records';
    return this.http.patch<any>(URL, body);

    // params: date / empresa / empleado
    //agregar api para actualizar el incidente
  }
}
