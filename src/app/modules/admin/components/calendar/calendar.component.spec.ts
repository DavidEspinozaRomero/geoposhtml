import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { CalendarComponent } from './calendar.component';
import { CalendarService } from '../../../../services/calendar.service';
import { EmployeesService } from '../../../../services/employees.service';
import { CalendarMonthEmployeeResponse, CalendarDay } from '../../../../models';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let calendarServiceSpy: {
    getMonth: ReturnType<typeof vi.fn>;
    getMonthByEmployee: ReturnType<typeof vi.fn>;
  };
  let employeesServiceSpy: {
    getEmployees: ReturnType<typeof vi.fn>;
  };

  const mockDays: CalendarDay[] = [
    {
      date: '2026-08-01',
      dayOfWeek: 6,
      workday: { id: 1, day: 1 },
      records: [{ id: 1, checkIn: '08:00', checkOut: '17:00', incident: null, isActive: true }],
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
  ];

  const mockResponse: CalendarMonthEmployeeResponse = {
    month: '2026-08',
    employeeId: 1,
    days: mockDays,
  };

  const mockEmployees = [
    { id: '1', name: 'Juan Pérez', username: 'juanp' },
    { id: '2', name: 'María López', username: 'marial' },
  ];

  beforeEach(async () => {
    calendarServiceSpy = {
      getMonth: vi.fn(),
      getMonthByEmployee: vi.fn().mockReturnValue(of(mockResponse)),
    };
    employeesServiceSpy = {
      getEmployees: vi.fn().mockReturnValue(of(mockEmployees)),
    };

    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [
        provideHttpClient(),
        { provide: CalendarService, useValue: calendarServiceSpy },
        { provide: EmployeesService, useValue: employeesServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', () => {
    expect(employeesServiceSpy.getEmployees).toHaveBeenCalledTimes(1);
    expect(component.employees().length).toBe(2);
    expect(component.employees()[0]).toEqual({ id: 1, name: 'Juan Pérez', username: 'juanp' });
  });

  it('should set employees to empty on error', () => {
    employeesServiceSpy.getEmployees.mockReturnValueOnce(throwError(() => new Error('fail')));
    component.loadEmployees();
    expect(component.employees()).toEqual([]);
  });

  it('should not load month before employee selected', () => {
    expect(calendarServiceSpy.getMonthByEmployee).not.toHaveBeenCalled();
    expect(component.days()).toEqual([]);
  });

  it('should load month when employee selected', () => {
    component.onEmployeeChange('1');
    expect(component.selectedEmployeeId()).toBe(1);
    expect(calendarServiceSpy.getMonthByEmployee).toHaveBeenCalledTimes(1);
    expect(component.days()).toEqual(mockDays);
  });

  it('should build weeks grid from days', () => {
    component.onEmployeeChange('1');
    expect(component.weeks().length).toBeGreaterThan(0);
    // each week row has exactly 7 columns
    for (const week of component.weeks()) {
      expect(week.length).toBe(7);
    }
  });

  it('should generate correct monthParam', () => {
    const now = component.now();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    expect(component.monthParam()).toBe(expected);
  });

  it('should set loading to false after API response', () => {
    component.onEmployeeChange('1');
    expect(component.loading()).toBe(false);
  });

  it('should change month and reload', () => {
    component.onEmployeeChange('1');
    const origMonth = component.month();
    calendarServiceSpy.getMonthByEmployee.mockClear();

    component.changeMonth(1);

    expect(component.month()).toBe(origMonth === 11 ? 0 : origMonth + 1);
    expect(calendarServiceSpy.getMonthByEmployee).toHaveBeenCalledTimes(1);
  });

  it('should clear selected day when changing employee', () => {
    component.onEmployeeChange('1');
    component.openDay(mockDays[0]);
    expect(component.selectedDay()).not.toBeNull();

    component.onEmployeeChange('2');
    expect(component.selectedDay()).toBeNull();
  });

  it('should open the modal when selecting a day', () => {
    component.onEmployeeChange('1');
    expect(component.selectedDay()).toBeNull();
    expect(component.modalOpen()).toBe(false);

    component.openDay(mockDays[0]);
    expect(component.selectedDay()).toBe(mockDays[0]);
    expect(component.modalOpen()).toBe(true);
  });

  it('should close the modal and deselect the day', () => {
    component.onEmployeeChange('1');
    component.openDay(mockDays[0]);
    component.closeModal();
    expect(component.selectedDay()).toBeNull();
    expect(component.modalOpen()).toBe(false);
  });

  it('should have all status class mappings', () => {
    expect(component.statusClassNames['complete']).toBe('bg-green-600 text-white');
    expect(component.statusClassNames['partial']).toBe('bg-yellow-400 text-black');
    expect(component.statusClassNames['absent']).toBe('bg-red-600 text-white');
    expect(component.statusClassNames['rest']).toBe('bg-gray-400 text-white');
    expect(component.statusClassNames['event']).toBe('bg-blue-500 text-white');
  });
});
