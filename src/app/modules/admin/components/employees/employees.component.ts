import { Component, OnInit, inject, signal } from '@angular/core';
import { LucidePencil, LucideTrash2 } from '@lucide/angular';

import { Employee } from '../../../../models/employee.model';
import { EmployeesService } from '../../../../services/employees.service';
import { FilterEmployeeByNameUsernamePipe } from '../../../../pipes/filter-employee-by-name-username.pipe';
import { FilterActiveEmployeesPipe } from '../../../../pipes/filter-active-employees.pipe';
import { FilterCompanyEmployeePipe } from '../../../../pipes/filter-company-employee.pipe';
import { EmployeeModalComponent } from '../employee-modal/employee-modal.component';
import { EmptyComponent, LoadingComponent } from '../../../../components';
import {
  AppBtnDirective,
  AppCardDirective,
  AppCardHeaderDirective,
  AppFilterLabelDirective,
  AppFilterSectionDirective,
  AppInputDirective,
  AppSelectDirective,
} from '../../../../shared/ui';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    FilterEmployeeByNameUsernamePipe,
    FilterCompanyEmployeePipe,
    FilterActiveEmployeesPipe,
    EmployeeModalComponent,
    EmptyComponent,
    LoadingComponent,
    LucidePencil,
    LucideTrash2,
    AppBtnDirective,
    AppCardDirective,
    AppCardHeaderDirective,
    AppFilterSectionDirective,
    AppFilterLabelDirective,
    AppInputDirective,
    AppSelectDirective,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit {
  employeesService = inject(EmployeesService);

  employees = signal<Employee[]>([]);
  employee = signal<Employee | undefined>(undefined);
  modalOpen = signal(false);
  loading = signal(false);
  success = signal(false);

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.loading.set(true);
    this.employeesService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.success.set(true);
      },
      error: () => {
        this.success.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  removeEmployee(employee: Employee) {
    this.employeesService.removeEmployee(employee).subscribe({
      next: () => {
        this.employees.update((ems) => ems.filter((e) => e.id !== employee.id));
      },
    });
  }

  updateIsActiveEmployee(employee: Employee) {
    this.employeesService.updateEmployeeIsActive(employee).subscribe({
      next: (_updatedEmployee) => {
        this.employees.update((ems) =>
          ems.map((e) => (e.id === employee.id ? { ...e, isActive: !e.isActive } : e)),
        );
      },
    });
  }

  updateEmployees(data: Employee) {
    this.employees.update((ems) => {
      const idx = ems.findIndex((e) => e.id === data.id);
      if (idx !== -1) {
        const copy = [...ems];
        copy[idx] = data;
        return copy;
      }
      return [...ems, data];
    });
  }

  openCreate(): void {
    this.employee.set(undefined);
    this.modalOpen.set(true);
  }

  editEmployee(employee: Employee) {
    this.employee.set(employee);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.employee.set(undefined);
    this.modalOpen.set(false);
  }
}
