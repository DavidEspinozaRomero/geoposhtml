import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendaryModalComponent } from './calendary-modal.component';
import { CalendarDay } from '../../../../models';

describe('CalendaryModalComponent', () => {
  let component: CalendaryModalComponent;
  let fixture: ComponentFixture<CalendaryModalComponent>;

  const day: CalendarDay = {
    date: '2026-09-11',
    dayOfWeek: 5,
    workday: null,
    records: [],
    events: [],
    status: 'partial',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendaryModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendaryModalComponent);
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
    expect(badge.textContent.trim()).toBe('partial');
    expect(badge.classList.contains('bg-yellow-400')).toBe(true);
    expect(badge.classList.contains('text-black')).toBe(true);
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
});
