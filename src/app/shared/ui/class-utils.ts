import { effect, type ElementRef } from '@angular/core';

/**
 * Binds a computed set of CSS classes onto a host element, swapping only the
 * classes produced by `compute()` while leaving every class added by the
 * consumer untouched (e.g. `w-full`, `mt-4` on a button).
 *
 * `compute()` is re-run reactively: any signal read inside it becomes a
 * dependency, so the class set follows `input()` changes. The effect is
 * created in the caller's injection context, so Angular destroys it together
 * with the directive/component.
 *
 * The result is coerced defensively (`String(compute() ?? '')`), so a
 * consumer lookup that returns `undefined` for an unknown key degrades to no
 * classes instead of throwing a TypeError.
 */
export function bindDynamicClasses(host: ElementRef<HTMLElement>, compute: () => string): void {
  let last = '';

  const sync = (): void => {
    const next = String(compute() ?? '').trim();
    if (next === last) return;

    const nextList = next.split(/\s+/).filter(Boolean);
    const prevList = last.split(/\s+/).filter(Boolean);

    for (const cls of prevList) {
      if (!nextList.includes(cls)) host.nativeElement.classList.remove(cls);
    }
    for (const cls of nextList) {
      if (!prevList.includes(cls)) host.nativeElement.classList.add(cls);
    }

    last = next;
  };

  sync();
  effect(sync);
}
