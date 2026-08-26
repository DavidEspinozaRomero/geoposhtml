import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs';

import { Company, PaginatedResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private readonly http = inject(HttpClient);
  #localURL = environment.apiUrl;

  getCompanies() {
    const URL = `${this.#localURL}companies`;
    return this.http.get<PaginatedResponse<Company>>(URL).pipe(map((res) => res.data));
  }

  getCompaniesByEmployeeWorkday(employeeID: number, day: number) {
    const queryParams = `day=${day}&employeeID=${employeeID}`;
    const URL = `${this.#localURL}companies/employee-workday?${queryParams}`;
    return this.http.get<PaginatedResponse<Company>>(URL).pipe(map((res) => res.data));
  }

  getCompanyById(companyId: string | number) {
    const URL = `${this.#localURL}companies/${companyId}`;
    return this.http.get<Company>(URL);
  }

  createCompany(company: Company) {
    const URL = `${this.#localURL}companies`;
    return this.http.post<Company>(URL, company);
  }

  updateCompany(company: Company) {
    const URL = `${this.#localURL}companies/${company.id}`;
    return this.http.patch<Company>(URL, company);
  }

  removeCompany(company: Company) {
    const URL = `${this.#localURL}companies/${company.id}`;
    return this.http.delete<Company>(URL);
  }
}
