import { Directive, ElementRef, inject, input } from '@angular/core';
import { bindDynamicClasses } from '../class-utils';

export type BtnVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type BtnSize = 'sm' | 'md' | 'lg';

const BTN_BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold ' +
  'transition-colors focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-blue-600 ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const BTN_VARIANT_CLASSES: Record<BtnVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
  danger: 'border border-red-600 text-red-600 hover:bg-red-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
};

const BTN_SIZE_CLASSES: Record<BtnSize, string> = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

/**
 * Shared button primitive (WU01). Applied as `[appBtn]` on a `<button>` (or
 * any element) and styled through Tailwind classes:
 *
 * - `variant` swaps the visual style (primary/secondary/danger/ghost).
 * - `size` swaps the padding/text preset (sm/md/lg).
 * - `disabled` sets the native `disabled` attribute, which also drives the
 *   `disabled:` Tailwind variants baked into the base classes.
 *
 * Classes added by the consumer (e.g. `w-full`, `mt-4`) are preserved; only
 * the variant/size classes are owned by the directive.
 */
@Directive({
  selector: '[appBtn]',
  standalone: true,
  host: {
    class: BTN_BASE_CLASSES,
    '[attr.disabled]': 'disabled() || null',
  },
})
export class AppBtnDirective {
  /** Visual style preset. */
  readonly variant = input<BtnVariant>('primary');

  /** Size preset. */
  readonly size = input<BtnSize>('md');

  /** Reflects native `disabled` and the `disabled:` style variants. */
  readonly disabled = input(false);

  constructor() {
    const host = inject(ElementRef<HTMLElement>);
    bindDynamicClasses(host, () => {
      const variant = BTN_VARIANT_CLASSES[this.variant()] ?? BTN_VARIANT_CLASSES.primary;
      const size = BTN_SIZE_CLASSES[this.size()];
      return `${variant} ${size}`;
    });
  }
}
