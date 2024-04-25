import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../models/employee.model';

@Pipe({
  name: 'filterActiveEmployees',
  standalone: true,
  pure: false,
})
export class FilterActiveEmployeesPipe implements PipeTransform {
  transform(arr: Employee[], value: string): Employee[] {
    if (!arr.length) return arr;
    if (!value) return arr;

    if (value === 'active') return arr.filter((employee) => employee.isActive);
    if (value === 'inactive')
      return arr.filter((employee) => !employee.isActive);

    return arr;
  }
}
