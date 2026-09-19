import { Directive } from '@angular/core';

/**
 * Shared card primitives (WU01). All-styles-are-static directives: consumer
 * classes merge with the host classes, so extra utilities (spacing, layout,
 * accent colors) compose freely.
 */

/** Root card surface. */
@Directive({
  selector: '[appCard]',
  standalone: true,
  host: {
    class: 'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm',
  },
})
export class AppCardDirective {}

/** Top strip of the card. */
@Directive({
  selector: '[appCardHeader]',
  standalone: true,
  host: {
    class: 'border-b border-slate-200 px-4 py-3 font-semibold',
  },
})
export class AppCardHeaderDirective {}

/** Main content area of the card. */
@Directive({
  selector: '[appCardBody]',
  standalone: true,
  host: {
    class: 'p-4',
  },
})
export class AppCardBodyDirective {}
