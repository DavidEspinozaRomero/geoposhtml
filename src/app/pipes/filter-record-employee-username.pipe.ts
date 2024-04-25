import { Pipe, PipeTransform } from '@angular/core';
import { Record } from '../models';

@Pipe({
  name: 'filterRecordEmployeeUsername',
  standalone: true,
})
export class FilterRecordEmployeeUsernamePipe implements PipeTransform {
  transform(arr: Record[], value: string): Record[] {
    if (!arr.length) return arr;
    if (!value) return arr;
    return arr.filter(
      (record) =>
        record.employeeName.toLowerCase().includes(value.toLocaleLowerCase()) ||
        record.employeeUsername
          .toLowerCase()
          .includes(value.toLocaleLowerCase()) ||
        record.companyName.toLowerCase().includes(value.toLocaleLowerCase())
    );
  }
}
