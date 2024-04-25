import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Employee, Workday } from '../models/employee.model';
import { map, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private readonly http = inject(HttpClient);
  #dirData = '../../assets/data/';
  constructor() {}

  getEmployees() {
    const URL = this.#dirData + 'employees.json';
    return this.http.get<Employee[]>(URL).pipe(
      map((res: any) => {
        res.employees.forEach((employee: Employee) => {
          employee.workdays = this.checkWorkdays(employee.workdays);
        });
        return res.employees;
      })
    );
  }
  getEmployeeById(employeeId: string) {
    const URL = this.#dirData + 'employees.json';
    return this.http.get<Employee>(URL).pipe(
      map((res: any) => {
        const employee = res.employees.find(
          (employee: Employee) => employee.id == employeeId
        );
        return employee;
      })
    );
  }

  createEmployee(employee: Employee) {
    return {
      ...employee,
      id: crypto.randomUUID(),
    };
    // return this.http.post<Employee>(
    //   '../modules/admin/data/employees.json',
    //   employee
    // );
  }

  updateEmployee(employee: Employee) {
    return employee;
    // return this.http.put<Employee>(
    //   '../modules/admin/data/employees.json',
    //   employee
    // );
  }

  removeEmployee(employee: Employee) {
    // return this.http.delete<Employee>('../modules/admin/data/employees.json', {
    //   body: employee,
    // });
  }

  checkWorkdays(workdays: Workday[] | undefined) {
    if (!workdays)
      return Array(7)
        .fill(0)
        .map((_, i) => {
          return {
            day: i,
            companiesIDs: [],
          };
        });

    let newWorkdays: Workday[] = Array(7)
      .fill(0)
      .map((_, i) => {
        const workday = workdays.find((workday) => workday.day === i);
        return {
          day: i,
          companiesIDs: [],
          ...workday,
          // checked: false,
        };
      });

    return newWorkdays;
  }
}
