import { Component, OnInit, inject, signal } from '@angular/core';
import { LucideDot, LucidePencil, LucideTrash2 } from '@lucide/angular';

import { Employee } from '../../../../models/employee.model';
import { EmployeesService } from '../../../../services/employees.service';
import { FilterEmployeeByNameUsernamePipe } from '../../../../pipes/filter-employee-by-name-username.pipe';
import { FilterActiveEmployeesPipe } from '../../../../pipes/filter-active-employees.pipe';
import { FilterCompanyEmployeePipe } from '../../../../pipes/filter-company-employee.pipe';
import { EmployeeModalComponent } from '../employee-modal/employee-modal.component';
import { EmptyComponent, LoadingComponent } from '../../../../components';

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
    LucideDot,
    LucidePencil,
    LucideTrash2,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit {
  employeesService = inject(EmployeesService);

  employees = signal<Employee[]>([]);
  employee = signal<Employee | undefined>(undefined);
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

  removeEmployee(_employee: Employee, i_employee: number) {
    this.employees.update((ems) => {
      const copy = [...ems];
      copy.splice(i_employee, 1);
      return copy;
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

  editEmployee(employee: Employee) {
    this.employee.set(employee);
  }
}
