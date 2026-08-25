import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { CalendarService } from './calendar.service';
import { CalendarMonthTeamResponse } from '../models';
import { environment } from '../../environments/environment';

describe('CalendarService', () => {
  let service: CalendarService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CalendarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMonth', () => {
    it('should GET calendar/month with month param', () => {
      const mockResponse: CalendarMonthTeamResponse = {
        month: '2026-01',
        employees: [
          {
            employee: { id: 1, name: 'Juan', username: 'juan' },
            days: [
              {
                date: '2026-01-01',
                dayOfWeek: 4,
                workday: null,
                records: [],
                events: [],
                status: 'rest',
              },
            ],
          },
        ],
      };

      service.getMonth('2026-01').subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(res.employees.length).toBe(1);
        expect(res.employees[0].employee.name).toBe('Juan');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}calendar/month?month=2026-01`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return empty employees array for a month with no data', () => {
      const mockResponse: CalendarMonthTeamResponse = { month: '2026-02', employees: [] };

      service.getMonth('2026-02').subscribe((res) => {
        expect(res.employees.length).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}calendar/month?month=2026-02`);
      req.flush(mockResponse);
    });
  });

  describe('getMonthByEmployee', () => {
    it('should GET calendar/month with month and employeeId params', () => {
      const mockResponse = {
        month: '2026-01',
        employeeId: 5,
        days: [
          {
            date: '2026-01-01',
            dayOfWeek: 4,
            workday: { id: 1, day: 1 },
            records: [],
            events: [],
            status: 'complete' as const,
          },
        ],
      };

      service.getMonthByEmployee('2026-01', 5).subscribe((res) => {
        expect(res.employeeId).toBe(5);
        expect(res.days.length).toBe(1);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}calendar/month?month=2026-01&employeeId=5`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
