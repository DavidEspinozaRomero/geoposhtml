import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../models/employee.model';

@Pipe({
  name: 'filterEmployeeByNameUsername',
  standalone: true,
  pure: false,
})
export class FilterEmployeeByNameUsernamePipe implements PipeTransform {
  transform(arr: Employee[], value: string): Employee[] {
    return arr.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLocaleLowerCase()) ||
        item.username.toLowerCase().includes(value.toLocaleLowerCase())
    );
  }
}
