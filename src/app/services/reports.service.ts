import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly http = inject(HttpClient);
  #localURL = environment.apiUrl;

  getMonthlyReport(month: string, format: 'xlsx' | 'csv' | 'pdf' = 'xlsx'): Observable<Blob> {
    const params = new HttpParams().set('month', month).set('format', format);
    const URL = `${this.#localURL}reports/monthly`;
    return this.http.get(URL, { params, responseType: 'blob' });
  }
}
