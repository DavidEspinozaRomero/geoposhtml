import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';

import { Observable, map, of } from 'rxjs';

import { Employee } from '../../../../models/employee.model';
import { EmployeesService } from '../../../../services/employees.service';
import { FilterKeyValuePipe } from '../../../../pipes/filter-key-value.pipe';
import { FilterEmployeeByNameUsernamePipe } from '../../../../pipes/filter-employee-by-name-username.pipe';
import { EmployeeModalComponent } from '../employee-modal/employee-modal.component';
import { FilterActiveEmployeesPipe } from '../../../../pipes/filter-active-employees.pipe';
import { FilterCompanyEmployeePipe } from '../../../../pipes/filter-company-employee.pipe';

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
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit {
  employeesService = inject(EmployeesService);
  // employees: Observable<Employee[]> = this.employeesService.getEmployees();
  employees: Employee[] = [];
  employee: Employee | undefined;

  ngOnInit(): void {
    this.employeesService
      .getEmployees()
      .subscribe((employees) => {
        this.employees = employees;
      })
      .add(() => {
        // agregar loader
      });
  }
  removeEmployee(employee: Employee, i_employee: number) {
    // this.employeesService.removeEmployee(employee);

    this.employees.splice(i_employee, 1);
  }

  editEmployee(employee: Employee, i_employee?: number) {
    this.employee = employee;
  }

  updateEmployees(data: Employee) {
    const idx = this.employees.findIndex((employee) => employee.id === data.id);
    if (idx !== -1) {
      this.employees.splice(idx, 1, data);
    } else {
      this.employees.push(data);
    }
  }

  updateIsActiveEmployee(employee: Employee) {
    employee.isActive = !employee.isActive;
  }
}
