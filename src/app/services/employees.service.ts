import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Employee, Workday, PaginatedResponse } from '../models';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private readonly http = inject(HttpClient);
  #apiUrl = environment.apiUrl;

  getEmployees(): Observable<Employee[]> {
    const URL = `${this.#apiUrl}employees`;
    return this.http.get<PaginatedResponse<Employee>>(URL).pipe(map((res) => res.data));
  }

  getEmployeeById(employeeId: string | number): Observable<Employee> {
    const URL = `${this.#apiUrl}employees/${employeeId}`;
    return this.http.get<Employee>(URL);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    const URL = `${this.#apiUrl}employees`;
    return this.http.post<Employee>(URL, employee);
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    const URL = `${this.#apiUrl}employees/${employee.id}`;
    return this.http.patch<Employee>(URL, employee);
  }

  updateEmployeeIsActive(employee: Employee): Observable<Employee> {
    const URL = `${this.#apiUrl}employees/isActive/${employee.id}`;
    return this.http.put<Employee>(URL, {});
  }

  removeEmployee(employee: Employee) {
    const URL = `${this.#apiUrl}employees/${employee.id}`;
    return this.http.delete<Employee>(URL);
  }

  checkWorkdays(workdays: Workday[] | undefined) {
    if (!workdays)
      return Array(7)
        .fill(0)
        .map((_, i) => ({
          day: i,
          companiesIDs: [],
        }));

    return Array(7)
      .fill(0)
      .map((_, i) => {
        const workday = workdays.find((w) => w.day === i);
        return {
          day: i,
          companiesIDs: [],
          ...workday,
        };
      });
  }
}
