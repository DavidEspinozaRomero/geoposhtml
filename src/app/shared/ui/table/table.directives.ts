import { Directive } from '@angular/core';

/**
 * Shared table primitives (WU01), extracted from the duplicated markup in
 * workday/records/events. All styles are static: consumer classes (e.g.
 * `mt-6` on the table) merge with the host classes.
 */

/** Table root. */
@Directive({
  selector: '[appTable]',
  standalone: true,
  host: {
    class: 'w-full text-sm text-slate-700',
  },
})
export class AppTableDirective {}

/** Header cell. */
@Directive({
  selector: '[appTh]',
  standalone: true,
  host: {
    class: 'px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500',
  },
})
export class AppThDirective {}

/** Body cell. */
@Directive({
  selector: '[appTd]',
  standalone: true,
  host: {
    class: 'px-3 py-2',
  },
})
export class AppTdDirective {}

/** Header row. */
@Directive({
  selector: '[appTrHead]',
  standalone: true,
  host: {
    class: 'border-b border-slate-200',
  },
})
export class AppTrHeadDirective {}

/** Body row. */
@Directive({
  selector: '[appTrBody]',
  standalone: true,
  host: {
    class: 'border-b border-slate-100 transition-colors hover:bg-slate-50',
  },
})
export class AppTrBodyDirective {}
