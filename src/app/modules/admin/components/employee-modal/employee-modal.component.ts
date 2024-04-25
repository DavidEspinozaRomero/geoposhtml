import { JsonPipe, NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { EmployeesService } from '../../../../services/employees.service';
import { Employee } from '../../../../models/employee.model';

@Component({
  selector: 'app-employee-modal',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, NgClass],
  templateUrl: './employee-modal.component.html',
  styleUrl: './employee-modal.component.scss',
})
export class EmployeeModalComponent implements OnChanges {
  @Input() employee: Employee | undefined;
  @Output() onSaveForm = new EventEmitter<Employee>();
  fb = inject(FormBuilder);
  employeesService = inject(EmployeesService);

  btnClose = viewChild<ElementRef<HTMLButtonElement>>('btnClose');
  employeeForm = this.fb.nonNullable.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    email: [
      '',
      [Validators.required, Validators.minLength(3), Validators.email],
    ],
    dni: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(11)],
    ],
    address: ['', [Validators.required, Validators.minLength(3)]],
    phone: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$'),
      ],
    ],
    insurance: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
    ],
    // companies: ['', [Validators.required, Validators.minLength(3)]],
    isActive: [true],
  });

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.employee) return;
    // this.employeeForm.patchValue(this.employee);
    this.employeeForm.reset(this.employee);
  }

  onSubmit() {
    this.employeeForm.markAllAsTouched();
    if (this.employeeForm.invalid) return console.log('Invalid Form'); // agregar mensaje de error

    let dataForm = structuredClone(this.employeeForm.value);

    const employee: Employee = {
      id: dataForm.id,
      name: dataForm.name!,
      username: dataForm.username!,
      password: dataForm.password!,
      email: dataForm.email!,
      dni: dataForm.dni!,
      address: dataForm.address!,
      phone: dataForm.phone!,
      insurance: dataForm.insurance!,
      isActive: dataForm.isActive!,
      companies: [],
    };

    if (!dataForm.id) {
      this.createEmployee(employee);
      return;
    }
    this.updateEmployee(employee);
  }

  createEmployee(employee: Employee) {
    const newEmployee = this.employeesService.createEmployee(employee); // TODO: agregar spinner mientras procesa la info
    this.onSaveForm.emit(newEmployee);
    this.employeeForm.reset();
    // enviar mensaje de exito!
    this.btnClose()?.nativeElement.click();
  }

  updateEmployee(employee: Employee) {
    this.employeesService.updateEmployee(employee); // TODO: agregar spinner mientras procesa la info
    this.onSaveForm.emit(employee);
    this.employeeForm.reset();
    // enviar mensaje de exito!
    this.btnClose()?.nativeElement.click();
  }
  isValidControl(form: FormGroup, name: string) {
    return form.get(name)?.errors && form.get(name)?.touched;
  }
}
