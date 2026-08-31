import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';

import { CalendarDay, Company } from '../../../../models';
import { CompaniesService } from '../../../../services/companies.service';

@Component({
  selector: 'app-day-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './day-modal.component.html',
  styleUrl: './day-modal.component.scss',
})
export class DayModalComponent {
  private readonly companiesService = inject(CompaniesService);

  day = input<CalendarDay | null>(null);
  employeeId = input<number>(0);
  closeRequest = output<void>();

  companies = signal<Company[]>([]);
  loadingCompanies = signal(false);

  isOpen = computed(() => this.day() !== null);

  private loadEffect = effect(() => {
    const day = this.day();
    if (!day) return;

    if (day.workday && this.employeeId() > 0) {
      this.loadCompanies(day.workday.day);
    } else {
      this.companies.set([]);
    }
  });

  statusColor(status: string): string {
    const map: Record<string, string> = {
      complete: 'success',
      partial: 'warning',
      absent: 'danger',
      rest: 'secondary',
      event: 'info',
    };
    return map[status] ?? 'secondary';
  }

  private loadCompanies(day: number) {
    const employeeId = this.employeeId();
    if (employeeId <= 0) return;

    this.loadingCompanies.set(true);
    this.companiesService.getCompaniesByEmployeeWorkday(employeeId, day).subscribe({
      next: (companies) => {
        this.companies.set(companies);
        this.loadingCompanies.set(false);
      },
      error: () => {
        this.companies.set([]);
        this.loadingCompanies.set(false);
      },
    });
  }
}
