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
import { statusClasses, statusVariant } from '../../../../shared/ui/icon-map';
import {
  AppBadgeDirective,
  AppBtnDirective,
  AppFilterLabelDirective,
  AppSelectDirective,
} from '../../../../shared/ui';

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
    AppBadgeDirective,
    AppBtnDirective,
    AppFilterLabelDirective,
    AppSelectDirective,
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
  modalOpen = signal(false);

  readonly statusClassNames = statusClasses;
  readonly statusVariant = statusVariant;

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
    this.closeModal();
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
    this.closeModal();
    this.loadMonth();
  }

  openDay(day: CalendarDay) {
    this.selectedDay.set(day);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.selectedDay.set(null);
    this.modalOpen.set(false);
  }
}
