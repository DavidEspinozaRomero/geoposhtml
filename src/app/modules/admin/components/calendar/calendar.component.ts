import { DatePipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { CalendarService } from '../../../../services/calendar.service';
import { CalendarDay, CalendarEmployee } from '../../../../models';
import { EmptyComponent, LoadingComponent } from '../../../../components';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [DatePipe, KeyValuePipe, TitleCasePipe, LoadingComponent, EmptyComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  private readonly calendarService = inject(CalendarService);

  now = signal<Date>(new Date());
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

  loading = signal(false);
  employees = signal<{ employee: CalendarEmployee; days: CalendarDay[] }[]>([]);
  selectedDay = signal<CalendarDay | null>(null);

  statusColor: Record<string, string> = {
    complete: 'success',
    partial: 'warning',
    absent: 'danger',
    rest: 'secondary',
    event: 'info',
  };

  ngOnInit(): void {
    this.loadMonth();
  }

  loadMonth() {
    this.loading.set(true);
    this.calendarService
      .getMonth(this.monthParam())
      .subscribe({
        next: (res) => {
          this.employees.set(res.employees);
        },
        error: () => {
          this.employees.set([]);
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
}
