import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeModalComponent } from './employee-modal.component';
import { Employee } from '../../../../models/employee.model';

describe('EmployeeModalComponent', () => {
  let component: EmployeeModalComponent;
  let fixture: ComponentFixture<EmployeeModalComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stay closed while the open input is false', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should open when the open input flips to true (create mode)', async () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isOpen()).toBe(true);
  });

  it('should reset the form with the employee values when an employee is provided (edit mode)', async () => {
    fixture.componentRef.setInput('employee', EMPLOYEE);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.employeeForm.value.name).toBe('Juan Perez');
    expect(component.employeeForm.value.id).toBe('emp-1');
  });

  it('should reset the form to empty when the employee is cleared (close)', async () => {
    fixture.componentRef.setInput('employee', EMPLOYEE);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.employeeForm.value.name).toBe('Juan Perez');

    fixture.componentRef.setInput('employee', undefined);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.employeeForm.value.name).toBe('');
    expect(component.employeeForm.value.id).toBe('');
  });
});
