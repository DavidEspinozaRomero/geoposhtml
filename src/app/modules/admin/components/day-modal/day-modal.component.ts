import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { LucideBuilding2, LucideX } from '@lucide/angular';

import { CalendarDay, Company } from '../../../../models';
import { CompaniesService } from '../../../../services/companies.service';
import { AppDialogComponent } from '../../../../shared/ui/dialog/dialog.component';
import { AppBadgeDirective } from '../../../../shared/ui';
import { statusVariant } from '../../../../shared/ui/icon-map';

@Component({
  selector: 'app-day-modal',
  standalone: true,
  imports: [DatePipe, AppBadgeDirective, LucideBuilding2, AppDialogComponent, LucideX],
  templateUrl: './day-modal.component.html',
})
export class DayModalComponent {
  private readonly companiesService = inject(CompaniesService);

  day = input<CalendarDay | null>(null);
  employeeId = input<number>(0);
  closeRequest = output<void>();

  companies = signal<Company[]>([]);
  loadingCompanies = signal(false);

  isOpen = computed(() => this.day() !== null);
  readonly statusVariant = statusVariant;

  private loadEffect = effect(() => {
    const day = this.day();
    if (!day) return;

    if (day.workday && this.employeeId() > 0) {
      this.loadCompanies(day.workday.day);
    } else {
      this.companies.set([]);
    }
  });

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
