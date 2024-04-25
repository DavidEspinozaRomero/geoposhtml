import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../models/employee.model';
import { filter } from 'rxjs';

@Pipe({
  name: 'filterCompanyEmployee',
  standalone: true,
  pure: false,
})
export class FilterCompanyEmployeePipe implements PipeTransform {
  transform(arr: Employee[], value: string): Employee[] {
    if (!arr.length) return arr;
    if (!value) return arr;
    return arr.filter((employee) =>
      employee.companies?.find((company) =>
        company.toLowerCase().includes(value.toLowerCase())
      )
    );

    // return arr.filter((employee) => employee.companies?.includes(value));
    return arr;
  }
}
