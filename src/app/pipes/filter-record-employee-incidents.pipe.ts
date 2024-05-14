import { Pipe, PipeTransform } from '@angular/core';
import { Record } from '../models';

@Pipe({
  name: 'filterRecordEmployeeIncidents',
  standalone: true,
})
export class FilterRecordEmployeeIncidentsPipe implements PipeTransform {
  transform(arr: Record[], value: string): Record[] {
    if (!arr.length) return arr;
    if (!value) return arr;

    if (value === 'sinIncidencias')
      return arr.filter(
        (record) => !record.incidentAdmin.length && !record.incident.length
      );

    if (value === 'conIncidencias')
      return arr.filter(
        (record) => record.incidentAdmin.length || record.incident.length
      );

    return arr;
  }
}
