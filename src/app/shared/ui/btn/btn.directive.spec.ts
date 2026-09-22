import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppBtnDirective, type BtnVariant } from './btn.directive';

/**
 * Mirror of the source constants in `btn.directive.ts` so the spec asserts
 * the exact class strings the directive owns.
 */
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

@Component({
  standalone: true,
  imports: [AppBtnDirective],
  template: `<button appBtn [variant]="variant" [disabled]="disabled">button</button>`,
})
class TestHost {
  variant: BtnVariant = 'primary';
  disabled = false;
}

describe('AppBtnDirective', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let button: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    button = fixture.debugElement.query(By.directive(AppBtnDirective)).nativeElement;
  });

  const setVariant = async (variant: BtnVariant): Promise<void> => {
    host.variant = variant;
    fixture.componentRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const setDisabled = async (disabled: boolean): Promise<void> => {
    host.disabled = disabled;
    fixture.componentRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const expectClasses = (el: HTMLElement, classes: string): void => {
    for (const cls of classes.split(/\s+/).filter(Boolean)) {
      expect(el.classList.contains(cls), `missing class '${cls}'`).toBe(true);
    }
  };

  it('applies the base button classes including the disabled styles', () => {
    expectClasses(button, BTN_BASE_CLASSES);
  });

  it('applies the default size classes (md) alongside the default variant', () => {
    expectClasses(button, 'px-4 py-2 text-sm');
  });

  it('swaps variant classes by input', async () => {
    await setVariant('secondary');
    expectClasses(button, BTN_VARIANT_CLASSES.secondary);
    expect(button.classList.contains('bg-blue-600')).toBe(false);

    await setVariant('danger');
    expectClasses(button, BTN_VARIANT_CLASSES.danger);
    expect(button.classList.contains('border-blue-600')).toBe(false);
  });

  it('reflects the native disabled attribute when disabled is true', async () => {
    await setDisabled(true);
    expect(button.getAttribute('disabled')).toBe('true');

    await setDisabled(false);
    expect(button.hasAttribute('disabled')).toBe(false);
  });

  it('does not throw on an unknown variant and falls back to primary', async () => {
    await expect(setVariant('bogus' as BtnVariant)).resolves.toBeUndefined();
    expectClasses(button, BTN_VARIANT_CLASSES.primary);
  });
});
