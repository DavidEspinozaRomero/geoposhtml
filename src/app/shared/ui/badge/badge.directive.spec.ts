import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppBadgeDirective, type BadgeVariant } from './badge.directive';

/**
 * Mirror of the source constants in `badge.directive.ts` so the spec asserts
 * the exact class strings the directive owns (base + full variant palette).
 */
const BADGE_BASE_CLASSES =
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold';

const BADGE_VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: 'bg-blue-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-400 text-black',
  danger: 'bg-red-600 text-white',
  neutral: 'bg-gray-400 text-white',
  info: 'bg-blue-500 text-white',
  emerald: 'bg-emerald-600 text-white',
};

@Component({
  standalone: true,
  imports: [AppBadgeDirective],
  template: `<span appBadge [variant]="variant">badge</span>`,
})
class TestHost {
  variant: BadgeVariant = 'primary';
}

describe('AppBadgeDirective', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let badge: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    badge = fixture.debugElement.query(By.directive(AppBadgeDirective)).nativeElement;
  });

  const setVariant = async (variant: BadgeVariant): Promise<void> => {
    host.variant = variant;
    fixture.componentRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const expectClasses = (el: HTMLElement, classes: string): void => {
    for (const cls of classes.split(/\s+/).filter(Boolean)) {
      expect(el.classList.contains(cls), `missing class '${cls}'`).toBe(true);
    }
  };

  it('applies the base badge classes', () => {
    expectClasses(badge, BADGE_BASE_CLASSES);
  });

  for (const [variant, pair] of Object.entries(BADGE_VARIANT_CLASSES)) {
    it(`applies the exact color pair for variant '${variant}'`, async () => {
      await setVariant(variant as BadgeVariant);
      expectClasses(badge, pair);
    });
  }

  it('swaps color pairs when the variant input changes', async () => {
    await setVariant('success');
    expect(badge.classList.contains('bg-green-600')).toBe(true);
    expect(badge.classList.contains('bg-blue-600')).toBe(false);

    await setVariant('danger');
    expect(badge.classList.contains('bg-green-600')).toBe(false);
    expect(badge.classList.contains('bg-red-600')).toBe(true);
  });

  it('does not throw on an unknown variant and falls back to the neutral pair', async () => {
    await expect(setVariant('bogus' as BadgeVariant)).resolves.toBeUndefined();
    expectClasses(badge, 'bg-gray-400 text-white');
    expect(badge.classList.contains('bg-blue-600')).toBe(false);
  });
});
