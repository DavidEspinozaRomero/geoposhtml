import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';

import { Employee } from '../../../../models/employee.model';
import { EmployeesService } from '../../../../services/employees.service';
import { FilterKeyValuePipe } from '../../../../pipes/filter-key-value.pipe';
import { FilterEmployeeByNameUsernamePipe } from '../../../../pipes/filter-employee-by-name-username.pipe';
import { EmployeeModalComponent } from '../employee-modal/employee-modal.component';
import { FilterActiveEmployeesPipe } from '../../../../pipes/filter-active-employees.pipe';
import { FilterCompanyEmployeePipe } from '../../../../pipes/filter-company-employee.pipe';
import { EmptyComponent, LoadingComponent } from '../../../../components';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    NgFor,
    AsyncPipe,
    FilterKeyValuePipe,
    FilterEmployeeByNameUsernamePipe,
    FilterCompanyEmployeePipe,
    FilterActiveEmployeesPipe,
    EmployeeModalComponent,
    EmptyComponent,
    LoadingComponent,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit {
  employeesService = inject(EmployeesService);
  // employees: Observable<Employee[]> = this.employeesService.getEmployees();
  employees: Employee[] = [];
  employee: Employee | undefined;
  config = {
    loading: false,
    success: false,
  };

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.config.loading = true;
    this.employeesService
      .getEmployees()
      .subscribe((employees) => {
        this.employees = employees;
        this.config.success = true;
      })
      .add(() => {
        this.config.loading = false;
      });
  }
  removeEmployee(employee: Employee, i_employee: number) {
    this.employees.splice(i_employee, 1);
    // this.employeesService
    //   .removeEmployee(employee)
    //   .subscribe((res) => {
    //   })
    //   .add(() => {});
  }

  updateIsActiveEmployee(employee: Employee) {
    this.employeesService
      .updateEmployeeIsActive(employee)
      .subscribe((updatedEmployee) => {
        employee.isActive = !employee.isActive;
      })
      .add();
  }

  updateEmployees(data: Employee) {
    const idx = this.employees.findIndex((employee) => employee.id === data.id);
    if (idx !== -1) {
      this.employees.splice(idx, 1, data);
    } else {
      this.employees.push(data);
    }
  }

  editEmployee(employee: Employee, i_employee?: number) {
    this.employee = employee;
  }
}
