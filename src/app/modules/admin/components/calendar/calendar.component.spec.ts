import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { CalendarComponent } from './calendar.component';
import { CalendarService } from '../../../../services/calendar.service';
import { CalendarMonthTeamResponse } from '../../../../models';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let calendarServiceSpy: {
    getMonth: ReturnType<typeof vi.fn>;
    getMonthByEmployee: ReturnType<typeof vi.fn>;
  };

  const mockResponse: CalendarMonthTeamResponse = {
    month: '2026-08',
    employees: [
      {
        employee: { id: 1, name: 'Juan Pérez', username: 'juanp' },
        days: [
          {
            date: '2026-08-01',
            dayOfWeek: 6,
            workday: { id: 1, day: 1 },
            records: [
              { id: 1, checkIn: '08:00', checkOut: '17:00', incident: null, isActive: true },
            ],
            events: [],
            status: 'complete',
          },
          {
            date: '2026-08-02',
            dayOfWeek: 7,
            workday: null,
            records: [],
            events: [],
            status: 'rest',
          },
        ],
      },
    ],
  };

  beforeEach(async () => {
    calendarServiceSpy = {
      getMonth: vi.fn().mockReturnValue(of(mockResponse)),
      getMonthByEmployee: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [provideHttpClient(), { provide: CalendarService, useValue: calendarServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call CalendarService.getMonth on init', () => {
    expect(calendarServiceSpy.getMonth).toHaveBeenCalledTimes(1);
    expect(calendarServiceSpy.getMonth).toHaveBeenCalledWith(component.monthParam());
  });

  it('should set employees from API response', () => {
    expect(component.employees().length).toBe(1);
    expect(component.employees()[0].employee.name).toBe('Juan Pérez');
  });

  it('should generate correct monthParam', () => {
    const now = component.now();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    expect(component.monthParam()).toBe(expected);
  });

  it('should generate localized monthLabel', () => {
    const label = component.monthLabel();
    expect(label).toBeTruthy();
    expect(typeof label).toBe('string');
  });

  it('should set loading to false after API response', () => {
    expect(component.loading()).toBe(false);
  });

  it('should set employees to empty array on API error', () => {
    calendarServiceSpy.getMonth.mockReturnValueOnce(throwError(() => new Error('fail')));

    component.loadMonth();
    expect(component.employees()).toEqual([]);
  });

  it('should set loading=false after error', () => {
    calendarServiceSpy.getMonth.mockReturnValueOnce(throwError(() => new Error('fail')));
    component.loadMonth();
    expect(component.loading()).toBe(false);
  });

  it('should change month and reload', () => {
    const origMonth = component.month();
    calendarServiceSpy.getMonth.mockClear();

    component.changeMonth(1);

    expect(component.month()).toBe(origMonth + 1);
    expect(calendarServiceSpy.getMonth).toHaveBeenCalledTimes(1);
  });

  it('should go to previous month', () => {
    const origYear = component.year();
    const origMonth = component.month();

    component.changeMonth(-1);

    if (origMonth === 0) {
      expect(component.year()).toBe(origYear - 1);
      expect(component.month()).toBe(11);
    } else {
      expect(component.month()).toBe(origMonth - 1);
    }
  });

  it('should select a day', () => {
    expect(component.selectedDay()).toBeNull();

    const day = component.employees()[0].days[0];
    component.selectDay(day);
    expect(component.selectedDay()).toBe(day);
  });

  it('should deselect a day', () => {
    component.selectDay(component.employees()[0].days[0]);
    component.selectedDay.set(null);
    expect(component.selectedDay()).toBeNull();
  });

  it('should have all status color mappings', () => {
    expect(component.statusColor['complete']).toBe('success');
    expect(component.statusColor['partial']).toBe('warning');
    expect(component.statusColor['absent']).toBe('danger');
    expect(component.statusColor['rest']).toBe('secondary');
    expect(component.statusColor['event']).toBe('info');
  });
});
