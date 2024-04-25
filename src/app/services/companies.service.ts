import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { map } from 'rxjs';

import { Company } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private readonly http = inject(HttpClient);
  #dirData = '../../assets/data/';
  constructor() {}

  getCompanies() {
    const URL = this.#dirData + 'companies.json';
    return this.http.get<Company[]>(URL).pipe(map((res: any) => res.companies));
  }
  getCompanyById(companyId: string) {
    const URL = this.#dirData + 'companies.json';
    return this.http.get<Company>(URL).pipe(
      map((res: any) => {
        const company = res.companies.find(
          (company: Company) => company.id == companyId
        );
        return company;
      })
    );
  }

  createCompany(company: Company) {
    return {
      ...company,
      id: crypto.randomUUID(),
    };
    // return this.http.post<Company>(
    //   '../modules/admin/data/companys.json',
    //   company
    // );
  }

  updateCompany(company: Company) {
    return company;
    // return this.http.put<Company>(
    //   '../modules/admin/data/companys.json',
    //   company
    // );
  }

  removeCompany(company: Company) {
    // return this.http.delete<Company>('../modules/admin/data/companys.json', {
    //   body: company,
    // });
  }
}
