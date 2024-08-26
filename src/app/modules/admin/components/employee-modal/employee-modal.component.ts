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
  signal,
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
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-employee-modal',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, NgClass],
  templateUrl: './employee-modal.component.html',
  styleUrl: './employee-modal.component.scss',
})
export class EmployeeModalComponent implements OnChanges {
  // TODO: cambiar a  Signal input/output
  @Input() employee: Employee | undefined;
  @Output() onSaveForm = new EventEmitter<Employee>();
  fb = inject(FormBuilder);
  employeesService = inject(EmployeesService);
  utilsService = inject(UtilsService);
  config = {
    loading: false,
    error: false,
    success: false,
  };

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
  isHidenPassword = signal(true);

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.employee) return;
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
    this.config.loading = true;
    const { id, ...employeeRest } = employee;
    console.log(employee);
    this.employeesService
      .createEmployee(employeeRest)
      .subscribe((newEmployee) => {
        this.onSaveForm.emit(newEmployee);
        this.employeeForm.reset();
        this.config.success = true;
      })
      .add(() => {
        this.config.loading = false;
        this.btnClose()?.nativeElement.click();
      });
    // TODO: agregar spinner mientras procesa la info
    // enviar mensaje de exito!
  }

  updateEmployee(employee: Employee) {
    this.config.loading = true;
    this.employeesService
      .updateEmployee(employee)
      .subscribe((employee) => {
        this.onSaveForm.emit(employee);
        this.config.success = true;
      })
      .add(() => {
        this.config.loading = false;

        this.employeeForm.reset();
        this.btnClose()?.nativeElement.click();
      });
    // TODO: enviar mensaje de exito!
  }

  showPassword() {
    this.isHidenPassword.set(!this.isHidenPassword());
  }
}
