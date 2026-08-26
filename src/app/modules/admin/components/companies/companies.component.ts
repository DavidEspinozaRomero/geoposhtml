import { Component, OnInit, inject, signal } from '@angular/core';

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
  companies = signal<Company[]>([]);
  company = signal<Company | undefined>(undefined);

  ngOnInit(): void {
    this.getAllCompanies();
  }

  getAllCompanies() {
    this.companiesService.getCompanies().subscribe({
      next: (companies) => {
        this.companies.set(companies);
      },
    });
  }

  editCompany(company: Company) {
    this.company.set(company);
  }

  removeCompany(company: Company, idx: number) {
    this.companiesService.removeCompany(company).subscribe({
      next: () => {
        this.companies.update((cs) => {
          const copy = [...cs];
          copy.splice(idx, 1);
          return copy;
        });
      },
    });
  }

  updateCompany(data: Company) {
    this.companies.update((cs) => {
      const idx = cs.findIndex((c) => c.id === data.id);
      if (idx !== -1) {
        const copy = [...cs];
        copy[idx] = data;
        return copy;
      }
      return [...cs, data];
    });
  }
}
