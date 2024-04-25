import { Component, OnInit, inject } from '@angular/core';

import { Company } from '../../../../models';
import { CompaniesService } from '../../../../services/companies.service';
import { CompanyModalComponent } from '../company-modal/company-modal.component';
import { FilterKeyValuePipe } from '../../../../pipes/filter-key-value.pipe';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CompanyModalComponent, FilterKeyValuePipe],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
})
export class CompaniesComponent implements OnInit {
  companiesService = inject(CompaniesService);
  companies: Company[] = [];
  company: Company | undefined;

  constructor() {}
  ngOnInit(): void {
    this.getAllCompanies();
  }

  getAllCompanies() {
    this.companiesService
      .getCompanies()
      .subscribe((companies) => {
        this.companies = companies;
      })
      .add(() => {
        // agregar loader
      });
  }

  editCompany(company: Company) {
    this.company = company;
  }
  removeCompany(company: Company, idx: number) {
    this.companies.splice(idx, 1);
  }

  updateCompany(data: Company) {
    const idx = this.companies.findIndex((company) => company.id === data.id);
    if (idx !== -1) {
      this.companies.splice(idx, 1, data);
    } else {
      this.companies.push(data);
    }
  }
}
