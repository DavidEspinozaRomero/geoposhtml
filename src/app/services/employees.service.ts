import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Employee, Workday } from '../models/employee.model';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private readonly http = inject(HttpClient);
  #apiUrl = environment.apiUrl;
  constructor() {}

  getEmployees(): Observable<Employee[]> {
    const URL = this.#apiUrl + 'employees';
    return this.http.get<Employee[]>(URL).pipe(
      map((res: any) => {
        // res.employees.forEach((employee: Employee) => {
        //   employee.workdays = this.checkWorkdays(employee.workdays);
        // });
        return res;
      })
    );
  }
  getEmployeeById(employeeId: string | number) {
    const URL = this.#apiUrl + 'employees';
    return this.http.get<Employee>(URL).pipe(
      map((res: any) => {
        const employee = res.employees.find(
          (employee: Employee) => employee.id == employeeId
        );
        return employee;
      })
    );
  }

  createEmployee(employee: Employee): Observable<Employee> {
    const URL = this.#apiUrl + 'employees';
    return this.http.post<Employee>(URL, employee).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  updateEmployee(employee: Employee) {
    const URL = this.#apiUrl + 'employees/' + employee.id;
    return this.http.patch<Employee>(URL, employee).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  updateEmployeeIsActive(employee: Employee) {
    const URL = this.#apiUrl + 'employees/isActive/' + employee.id;
    return this.http.put<Employee>(URL, {}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  removeEmployee(employee: Employee) {
    const URL = this.#apiUrl + 'employees';

    // return this.http.delete<Employee>(URL, {
    //   body: employee,
    // });
  }

  //TODO: eliminar el metodo de checkWorkdays
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
