import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, of } from 'rxjs';

import { Record } from '../models/record.model';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  private readonly http = inject(HttpClient);
  #dirData = '../../assets/data/';
  constructor() {}

  newRecord(body: {}) {
    const URL = this.#dirData + 'records.json';
    const record = {
      ...body,
      id: crypto.randomUUID(),
      isActive: true,
    };
    return of(record);
    // return this.http.post<Record>(URL, body);
  }
  updateRecordByEmployee(body: {}) {
    const URL = this.#dirData + 'records.json';
    const record = {
      ...body,
      isActive: false,
    };
    return of(record);
    // return this.http.patch<Record>(URL, body);
  }
  getRecordsByEmployee() {
    const URL = this.#dirData + 'records.json';
    // agregar argumentos para paginacion
    return this.http.get<Record[]>(URL).pipe(
      map((res: any) => {
        return res.records;
      })
    );
  }
  getRecords() {
    const URL = this.#dirData + 'records.json';
    // agregar argumentos para paginacion
    return this.http.get<Record[]>(URL).pipe(
      map((res: any) => {
        return res.records;
      })
    );
  }

  getRecordById(recordId: string) {
    const URL = this.#dirData + 'records.json';
    return this.http
      .get<Record>(URL)
      .pipe(
        map((res: any) =>
          res.records.find((record: Record) => record.id == recordId)
        )
      );
  }

  updateRecordIncidentByAdmin(recordId: string, incident: string) {
    //agregar api para actualizar el incidente
  }
  updateRecordsIncidentByAdmin(body: {}) {
    const URL = this.#dirData + 'records.json';
    return this.http.patch<any>(URL, body);

    // params: date / empresa / empleado
    //agregar api para actualizar el incidente
  }
}
