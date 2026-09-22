import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayModalComponent } from './day-modal.component';
import { CalendarDay } from '../../../../models';

describe('DayModalComponent', () => {
  let component: DayModalComponent;
  let fixture: ComponentFixture<DayModalComponent>;

  const day: CalendarDay = {
    date: '2026-09-11',
    dayOfWeek: 5,
    workday: null,
    records: [],
    events: [],
    status: 'complete',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stay closed without a day', async () => {
    fixture.whenStable();
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('dialog');
    expect(dialog.hasAttribute('open')).toBe(false);
  });

  it('should open the dialog when the open input is set with a day', async () => {
    fixture.componentRef.setInput('day', day);
    fixture.componentRef.setInput('open', true);
    fixture.whenStable();
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('dialog');
    expect(dialog.hasAttribute('open')).toBe(true);
  });

  it('should not open from the day input alone (open is the single source of truth)', async () => {
    fixture.componentRef.setInput('day', day);
    fixture.whenStable();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
    const dialog = fixture.nativeElement.querySelector('dialog');
    expect(dialog.hasAttribute('open')).toBe(false);
  });

  it('should render the status badge with Tailwind classes', async () => {
    fixture.componentRef.setInput('day', day);
    fixture.componentRef.setInput('open', true);
    fixture.whenStable();
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.status-badge');
    expect(badge.textContent.trim()).toBe('complete');
    expect(badge.classList.contains('bg-green-600')).toBe(true);
    expect(badge.classList.contains('text-white')).toBe(true);
  });

  it('should emit closeRequest when the footer button is clicked', async () => {
    fixture.componentRef.setInput('day', day);
    fixture.componentRef.setInput('open', true);
    fixture.whenStable();
    fixture.detectChanges();
    const spy = vi.spyOn(component.closeRequest, 'emit');
    const button = fixture.nativeElement.querySelector('.modal-footer button');
    button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should close the dialog when the open input is cleared', async () => {
    fixture.componentRef.setInput('day', day);
    fixture.componentRef.setInput('open', true);
    fixture.whenStable();
    fixture.detectChanges();
    fixture.componentRef.setInput('open', false);
    fixture.whenStable();
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('dialog');
    expect(dialog.hasAttribute('open')).toBe(false);
  });
});
