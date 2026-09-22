import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EmployeesComponent } from './employees.component';
import { EmployeesService } from '../../../../services/employees.service';
import { Employee } from '../../../../models/employee.model';

describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;
  let removed: Employee[];

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

  const employeesServiceMock = {
    getEmployees: () => of([] as Employee[]),
    removeEmployee: (employee: Employee) => {
      removed.push(employee);
      return of(employee);
    },
    updateEmployeeIsActive: () => of(EMPLOYEE),
  };

  beforeEach(async () => {
    removed = [];
    await TestBed.configureTestingModule({
      imports: [EmployeesComponent],
      providers: [{ provide: EmployeesService, useValue: employeesServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('openCreate should open the modal in create mode', () => {
    component.openCreate();
    expect(component.modalOpen()).toBe(true);
    expect(component.employee()).toBeUndefined();
  });

  it('editEmployee should set the employee and open the modal', () => {
    component.editEmployee(EMPLOYEE);
    expect(component.employee()).toEqual(EMPLOYEE);
    expect(component.modalOpen()).toBe(true);
  });

  it('removeEmployee should call the service and remove the employee by id', () => {
    const another = { ...EMPLOYEE, id: 'emp-2', name: 'Maria Gomez' };
    component.employees.set([EMPLOYEE, another]);

    component.removeEmployee(EMPLOYEE);

    expect(removed).toEqual([EMPLOYEE]);
    expect(component.employees()).toEqual([another]);
  });
});
