import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs';

import { Company } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private readonly http = inject(HttpClient);
  #localURL = environment.apiUrl;
  constructor() {}

  getCompanies() {
    const URL = this.#localURL + 'companies';
    return this.http.get<Company[]>(URL).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getCompaniesByEmployeeWorkday(employeeID: number, day: number) {
    const queryParams = `day=${day}&employeeID=${employeeID}`;
    const URL = `${this.#localURL}companies/employee-workday?${queryParams}`;
    return this.http.get<Company[]>(URL).pipe(map((res: any) => res));
  }
  getCompanyById(companyId: string | number) {
    const URL = this.#localURL + 'companies';
    return this.http.get<Company>(URL).pipe(
      map((res: any) => {
        const company = res.find((company: Company) => company.id == companyId);
        return company;
      })
    );
  }

  createCompany(company: Company) {
    const URL = this.#localURL + 'companies';
    return this.http.post<Company>(URL, company);
  }

  updateCompany(company: Company) {
    const URL = this.#localURL + 'companies/' + company.id;
    return this.http.patch<Company>(URL, company);
  }

  removeCompany(company: Company) {
    const URL = this.#localURL + 'companies/' + company.id;
    return this.http.delete<Company>(URL);
  }
}
