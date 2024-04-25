import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterKeyValue',
  standalone: true,
  pure: false,
})
export class FilterKeyValuePipe implements PipeTransform {
  transform(arr: any[], key: string, value: string): any[] {
    if (!arr.length) return arr;
    if (!key) return arr;
    if (value === 'undefined') return arr;

    if (typeof arr[0][key] === 'boolean' || typeof arr[0][key] === 'number') {
      return arr.filter((item) => item[key] == value);
    }

    if (typeof arr[0][key] === 'string' && typeof value === 'string') {
      return (
        arr.filter((item) =>
          item[key].toLowerCase().includes(value.toLocaleLowerCase())
        ) || []
      );
    }

    return arr;
  }
}
