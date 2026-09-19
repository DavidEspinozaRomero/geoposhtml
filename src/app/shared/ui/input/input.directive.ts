import { Directive, ElementRef, inject, input } from '@angular/core';
import { bindDynamicClasses } from '../class-utils';

const APP_INPUT_BASE_CLASSES =
  'w-full rounded-lg border px-3 py-2 text-sm text-slate-900 ' +
  'placeholder:text-slate-400 focus:outline-none focus:ring-2';

const APP_INPUT_STATE_CLASSES: Record<'default' | 'error', string> = {
  default: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/30',
  error: 'border-red-400 focus:border-red-500 focus:ring-red-500/30',
};

/**
 * Shared text-input primitive (WU01). Applied as `[appInput]` on `<input>`.
 * `hasError` swaps the border/focus ring to the error palette and reflects
 * `aria-invalid`. Border/focus classes are owned by the directive; classes
 * added by the consumer are preserved.
 */
@Directive({
  selector: '[appInput]',
  standalone: true,
  host: {
    class: APP_INPUT_BASE_CLASSES,
    '[attr.aria-invalid]': 'hasError() ? "true" : null',
  },
})
export class AppInputDirective {
  /** Swaps to the error palette when `true`. */
  readonly hasError = input(false);

  constructor() {
    const host = inject(ElementRef<HTMLElement>);
    bindDynamicClasses(host, () => APP_INPUT_STATE_CLASSES[this.hasError() ? 'error' : 'default']);
  }
}

/**
 * Shared `<select>` primitive (WU01). Same contract as `[appInput]` plus the
 * `bg-white` needed to keep native selects consistent with inputs.
 */
@Directive({
  selector: '[appSelect]',
  standalone: true,
  host: {
    class: `${APP_INPUT_BASE_CLASSES} bg-white`,
    '[attr.aria-invalid]': 'hasError() ? "true" : null',
  },
})
export class AppSelectDirective {
  /** Swaps to the error palette when `true`. */
  readonly hasError = input(false);

  constructor() {
    const host = inject(ElementRef<HTMLElement>);
    bindDynamicClasses(host, () => APP_INPUT_STATE_CLASSES[this.hasError() ? 'error' : 'default']);
  }
}
