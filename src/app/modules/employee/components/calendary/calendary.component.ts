import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';

import { CalendarService } from '../../../../services/calendar.service';
import { Auth } from '../../../../services/auth';
import { CalendarDay, CalendarMonthEmployeeResponse } from '../../../../models';
import { CalendaryModalComponent } from '../calendary-modal/calendary-modal.component';
import { LoadingComponent, EmptyComponent } from '../../../../components';

@Component({
  selector: 'app-calendary',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, CalendaryModalComponent, LoadingComponent, EmptyComponent],
  templateUrl: './calendary.component.html',
  styleUrl: './calendary.component.scss',
})
export class CalendaryComponent implements OnInit {
  private readonly calendarService = inject(CalendarService);
  private readonly auth = inject(Auth);

  now = signal<Date>(new Date());
  loading = signal(false);
  days = signal<CalendarDay[]>([]);
  selectedDay = signal<CalendarDay | null>(null);

  year = computed(() => this.now().getFullYear());
  month = computed(() => this.now().getMonth());
  monthLabel = computed(() => {
    const d = new Date(this.year(), this.month());
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  });
  monthParam = computed(() => {
    const m = String(this.month() + 1).padStart(2, '0');
    return `${this.year()}-${m}`;
  });

  private get employeeId(): number {
    return this.auth.currentUser?.employeeId ?? 0;
  }

  ngOnInit(): void {
    this.loadMonth();
  }

  loadMonth() {
    if (!this.employeeId) return;

    this.loading.set(true);
    this.calendarService
      .getMonthByEmployee(this.monthParam(), this.employeeId)
      .subscribe({
        next: (res: CalendarMonthEmployeeResponse) => {
          this.days.set(res.days);
        },
        error: () => {
          this.days.set([]);
        },
      })
      .add(() => {
        this.loading.set(false);
      });
  }

  changeMonth(quantity: number) {
    this.now.update((d) => new Date(d.getFullYear(), d.getMonth() + quantity));
    this.loadMonth();
  }

  selectDay(day: CalendarDay) {
    this.selectedDay.set(day);
  }

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
}
