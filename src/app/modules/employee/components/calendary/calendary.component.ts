import { DatePipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import {
  LucideBriefcase,
  LucideCalendarCheck,
  LucideCalendarDays,
  LucideChevronLeft,
  LucideChevronRight,
  LucideClock,
  LucideTriangleAlert,
} from '@lucide/angular';

import { CalendarService } from '../../../../services/calendar.service';
import { Auth } from '../../../../services/auth';
import { CalendarDay, CalendarMonthEmployeeResponse } from '../../../../models';
import { CalendaryModalComponent } from '../calendary-modal/calendary-modal.component';
import { LoadingComponent, EmptyComponent } from '../../../../components';
import { buildMonthGrid } from '../../../../utils/calendar-grid.util';
import { statusClasses, statusVariant } from '../../../../shared/ui/icon-map';
import { AppBadgeDirective, AppBtnDirective } from '../../../../shared/ui';

@Component({
  selector: 'app-calendary',
  standalone: true,
  imports: [
    DatePipe,
    KeyValuePipe,
    TitleCasePipe,
    CalendaryModalComponent,
    LoadingComponent,
    EmptyComponent,
    LucideBriefcase,
    LucideCalendarCheck,
    LucideCalendarDays,
    LucideChevronLeft,
    LucideChevronRight,
    LucideClock,
    LucideTriangleAlert,
    AppBadgeDirective,
    AppBtnDirective,
  ],
  templateUrl: './calendary.component.html',
  styleUrl: './calendary.component.scss',
})
export class CalendaryComponent implements OnInit {
  private readonly calendarService = inject(CalendarService);
  private readonly auth = inject(Auth);

  now = signal<Date>(new Date());
  loading = signal(false);
  days = signal<CalendarDay[]>([]);
  weeks = computed(() => buildMonthGrid(this.days()));
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

  readonly statusClassNames = statusClasses;
  readonly statusVariant = statusVariant;

  weekDayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

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
    this.selectedDay.set(null);
    this.loadMonth();
  }

  selectDay(day: CalendarDay) {
    this.selectedDay.set(day);
  }
}
