import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { EmployeesService } from './employees.service';
import { Employee } from '../models';
import { environment } from '../../environments/environment';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let httpMock: HttpTestingController;

  const EMPLOYEE: Employee = {
    id: 'emp-1',
    name: 'Juan Perez',
    username: 'juanp',
    password: 'Secret123',
    email: 'juan@example.com',
    dni: '12345678A',
    address: 'Calle Falsa 123',
    phone: '123456789',
    insurance: 'ABC123',
    isActive: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeesService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EmployeesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('removeEmployee', () => {
    it('should DELETE the employee by id', () => {
      service.removeEmployee(EMPLOYEE).subscribe((res) => {
        expect(res).toEqual(EMPLOYEE);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}employees/emp-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(EMPLOYEE);
    });
  });
});
