import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { Record } from '../models/record.model';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  private readonly http = inject(HttpClient);
  #dirData = '../../assets/data/';
  constructor() {}

  getRecords() {
    const URL = this.#dirData + 'records.json';
    // agregar argumentos para paginacion
    return this.http.get<Record[]>(URL).pipe(
      map((res: any) => {
        res.records.forEach((record: Record) => {
          record.googlemapurl = `https://maps.google.com/?q=${record.geo.latitude},${record.geo.longitude}`;
        });
        return res.records;
      })
    );
  }
}
