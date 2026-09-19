import { Directive } from '@angular/core';

/**
 * Shared filter primitives (WU01), extracted from the duplicated
 * `bg-sky-100 rounded-xl p-4` section and its labels in employees/companies.
 * All styles are static: consumer classes merge with the host classes.
 */

/** Filter panel section. */
@Directive({
  selector: '[appFilterSection]',
  standalone: true,
  host: {
    class: 'rounded-xl bg-sky-100 p-4',
  },
})
export class AppFilterSectionDirective {}

/** Label used inside a filter section. */
@Directive({
  selector: '[appFilterLabel]',
  standalone: true,
  host: {
    class: 'block text-sm font-medium text-slate-600',
  },
})
export class AppFilterLabelDirective {}
