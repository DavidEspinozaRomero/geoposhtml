import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppCardBodyDirective, AppCardDirective, AppCardHeaderDirective } from './card.directive';

/**
 * Exact host class strings from `card.directive.ts` — asserted verbatim, not
 * approximated.
 */
const APP_CARD_CLASSES = 'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm';
const APP_CARD_HEADER_CLASSES = 'border-b border-slate-200 px-4 py-3 font-semibold';
const APP_CARD_BODY_CLASSES = 'p-4';

@Component({
  standalone: true,
  imports: [AppCardDirective, AppCardHeaderDirective, AppCardBodyDirective],
  template: `
    <div appCard data-test="card"></div>
    <div appCardHeader data-test="header"></div>
    <div appCardBody data-test="body"></div>
  `,
})
class TestHost {}

describe('Card directives', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('[appCard] applies the exact root card class string', () => {
    const el = fixture.debugElement.query(By.directive(AppCardDirective))
      .nativeElement as HTMLElement;
    expect(el.className).toBe(APP_CARD_CLASSES);
  });

  it('[appCardHeader] applies the exact header class string', () => {
    const el = fixture.debugElement.query(By.directive(AppCardHeaderDirective))
      .nativeElement as HTMLElement;
    expect(el.className).toBe(APP_CARD_HEADER_CLASSES);
  });

  it('[appCardBody] applies the exact body class string', () => {
    const el = fixture.debugElement.query(By.directive(AppCardBodyDirective))
      .nativeElement as HTMLElement;
    expect(el.className).toBe(APP_CARD_BODY_CLASSES);
  });
});
