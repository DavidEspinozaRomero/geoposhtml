import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppInputDirective } from './input.directive';

/**
 * Mirror of the source constants in `input.directive.ts` so the spec asserts
 * the exact class strings the directive owns.
 */
const APP_INPUT_BASE_CLASSES =
  'w-full rounded-lg border px-3 py-2 text-sm text-slate-900 ' +
  'placeholder:text-slate-400 focus:outline-none focus:ring-2';

const APP_INPUT_STATE_CLASSES: Record<'default' | 'error', string> = {
  default: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/30',
  error: 'border-red-400 focus:border-red-500 focus:ring-red-500/30',
};

@Component({
  standalone: true,
  imports: [AppInputDirective],
  template: `<input appInput [hasError]="hasError" />`,
})
class TestHost {
  hasError = false;
}

describe('AppInputDirective', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let input: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.debugElement.query(By.directive(AppInputDirective)).nativeElement;
  });

  const setHasError = async (hasError: boolean): Promise<void> => {
    host.hasError = hasError;
    fixture.componentRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const expectClasses = (el: HTMLElement, classes: string): void => {
    for (const cls of classes.split(/\s+/).filter(Boolean)) {
      expect(el.classList.contains(cls), `missing class '${cls}'`).toBe(true);
    }
  };

  it('applies the base input classes', () => {
    expectClasses(input, APP_INPUT_BASE_CLASSES);
  });

  it('starts with the default state classes and no aria-invalid', () => {
    expectClasses(input, APP_INPUT_STATE_CLASSES.default);
    expect(input.classList.contains('border-red-400')).toBe(false);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  it('swaps to the error palette and sets aria-invalid="true" when hasError is true', async () => {
    await setHasError(true);
    expect(input.classList.contains('border-slate-300')).toBe(false);
    expectClasses(input, APP_INPUT_STATE_CLASSES.error);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('clears the error palette and aria-invalid when hasError flips back to false', async () => {
    await setHasError(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');

    await setHasError(false);
    expectClasses(input, APP_INPUT_STATE_CLASSES.default);
    expect(input.classList.contains('border-red-400')).toBe(false);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });
});
