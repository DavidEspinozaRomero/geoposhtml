import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AppDialogComponent } from './dialog.component';

describe('AppDialogComponent', () => {
  let fixture: ComponentFixture<AppDialogComponent>;
  let component: AppDialogComponent;
  let dialog: HTMLDialogElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialog = component['dlg']().nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('throws no error and stays closed while open is false', () => {
    expect(dialog.open).toBe(false);
  });

  it('invokes showModal when open flips to true', async () => {
    const showModal = vi.spyOn(dialog, 'showModal');

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(showModal).toHaveBeenCalled();
    expect(dialog.open).toBe(true);
  });

  it('invokes close when open flips back to false', async () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(dialog.open).toBe(true);

    const close = vi.spyOn(dialog, 'close');
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(close).toHaveBeenCalled();
    expect(dialog.open).toBe(false);
  });

  it('emits closeRequest on cancel (Esc)', async () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const emit = vi.spyOn(component.closeRequest, 'emit');
    dialog.dispatchEvent(new Event('cancel'));

    expect(emit).toHaveBeenCalled();
  });

  it('emits closeRequest on the native close event', async () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const emit = vi.spyOn(component.closeRequest, 'emit');
    dialog.dispatchEvent(new Event('close'));

    expect(emit).toHaveBeenCalled();
  });

  it('emits closeRequest when the backdrop (dialog element itself) is clicked', async () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const emit = vi.spyOn(component.closeRequest, 'emit');
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(emit).toHaveBeenCalled();
  });

  it('does not emit closeRequest when clicking inner content', async () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const emit = vi.spyOn(component.closeRequest, 'emit');
    const inner = document.createElement('div');
    dialog.appendChild(inner);
    inner.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(emit).not.toHaveBeenCalled();
  });
});