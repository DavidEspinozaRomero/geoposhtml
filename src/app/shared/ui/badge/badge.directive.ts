import { Directive, ElementRef, inject, input } from '@angular/core';
import { bindDynamicClasses } from '../class-utils';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';

const BADGE_BASE_CLASSES =
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold';

/**
 * Color pairs intentionally match `statusClasses` in `icon-map.ts`
 * (success/warning/danger/neutral/info) so day-status badges keep their
 * current look when migrated from `[ngClass]` to `[appBadge]`.
 */
const BADGE_VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: 'bg-blue-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-400 text-black',
  danger: 'bg-red-600 text-white',
  neutral: 'bg-gray-400 text-white',
  info: 'bg-blue-500 text-white',
};

/**
 * Shared badge primitive (WU01). Applied as `[appBadge]` on a `<span>` (or
 * any element). Variant color classes are owned by the directive; classes
 * added by the consumer are preserved.
 */
@Directive({
  selector: '[appBadge]',
  standalone: true,
  host: {
    class: BADGE_BASE_CLASSES,
  },
})
export class AppBadgeDirective {
  /** Color/style preset. */
  readonly variant = input<BadgeVariant>('primary');

  constructor() {
    const host = inject(ElementRef<HTMLElement>);
    bindDynamicClasses(host, () => BADGE_VARIANT_CLASSES[this.variant()]);
  }
}
