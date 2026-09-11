import { DatePipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
import { EmployeesService } from '../../../../services/employees.service';
import { CalendarDay, CalendarEmployee } from '../../../../models';
import { EmptyComponent, LoadingComponent } from '../../../../components';
import { DayModalComponent } from '../day-modal/day-modal.component';
import { buildMonthGrid } from '../../../../utils/calendar-grid.util';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    DatePipe,
    KeyValuePipe,
    TitleCasePipe,
    LoadingComponent,
    EmptyComponent,
    DayModalComponent,
    LucideBriefcase,
    LucideCalendarCheck,
    LucideCalendarDays,
    LucideChevronLeft,
    LucideChevronRight,
    LucideClock,
    LucideTriangleAlert,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  private readonly calendarService = inject(CalendarService);
  private readonly employeesService = inject(EmployeesService);

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
  loadingEmployees = signal(false);
  employees = signal<CalendarEmployee[]>([]);
  selectedEmployeeId = signal<number | null>(null);
  days = signal<CalendarDay[]>([]);
  weeks = computed(() => buildMonthGrid(this.days()));
  selectedDay = signal<CalendarDay | null>(null);

  statusColor: Record<string, string> = {
    complete: 'success',
    partial: 'warning',
    absent: 'danger',
    rest: 'secondary',
    event: 'info',
  };

  weekDayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loadingEmployees.set(true);
    this.employeesService.getEmployees().subscribe({
      next: (empList) => {
        this.employees.set(
          empList
            .filter((e) => e.id !== undefined)
            .map((e) => ({ id: Number(e.id), name: e.name, username: e.username })),
        );
        this.loadingEmployees.set(false);
      },
      error: () => {
        this.employees.set([]);
        this.loadingEmployees.set(false);
      },
    });
  }

  onEmployeeChange(value: string) {
    const id = Number(value);
    this.selectedEmployeeId.set(id);
    this.selectedDay.set(null);
    this.loadMonth();
  }

  loadMonth() {
    const employeeId = this.selectedEmployeeId();
    if (!employeeId) {
      this.days.set([]);
      return;
    }

    this.loading.set(true);
    this.calendarService.getMonthByEmployee(this.monthParam(), employeeId).subscribe({
      next: (res) => {
        this.days.set(res.days);
        this.loading.set(false);
      },
      error: () => {
        this.days.set([]);
        this.loading.set(false);
      },
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
