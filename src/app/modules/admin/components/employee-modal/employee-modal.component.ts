import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideEye, LucideX } from '@lucide/angular';

import { EmployeesService } from '../../../../services/employees.service';
import { Employee } from '../../../../models/employee.model';
import { UtilsService } from '../../../../services/utils.service';
import { AppDialogComponent } from '../../../../shared/ui/dialog/dialog.component';
import { AppBtnDirective, AppInputDirective } from '../../../../shared/ui';

@Component({
  selector: 'app-employee-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    LucideEye,
    LucideX,
    AppDialogComponent,
    AppBtnDirective,
    AppInputDirective,
  ],
  templateUrl: './employee-modal.component.html',
  styleUrl: './employee-modal.component.scss',
})
export class EmployeeModalComponent {
  employee = input<Employee | undefined>();
  open = input(false);
  @Output() saveForm = new EventEmitter<Employee>();
  closeRequest = output<void>();
  isOpen = computed(() => this.open());

  fb = inject(FormBuilder);
  employeesService = inject(EmployeesService);
  utilsService = inject(UtilsService);
  config = {
    loading: false,
    error: false,
    success: false,
  };

  employeeForm = this.fb.nonNullable.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
    dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(11)]],
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
    insurance: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    isActive: [true],
  });
  isHidenPassword = signal(true);

  constructor() {
    effect(() => {
      const employee = this.employee();
      if (employee) {
        this.employeeForm.reset(employee);
      } else {
        this.employeeForm.reset();
      }
    });
  }

  onSubmit() {
    this.employeeForm.markAllAsTouched();
    if (this.employeeForm.invalid) return;

    const dataForm = structuredClone(this.employeeForm.value);

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
    };

    if (!dataForm.id) {
      this.createEmployee(employee);
      return;
    }
    this.updateEmployee(employee);
  }

  createEmployee(employee: Employee) {
    this.config.loading = true;
    const { id: _id, ...employeeRest } = employee;
    this.employeesService
      .createEmployee(employeeRest)
      .subscribe((newEmployee) => {
        this.saveForm.emit(newEmployee);
        this.employeeForm.reset();
        this.config.success = true;
      })
      .add(() => {
        this.config.loading = false;
        this.closeRequest.emit();
      });
    // TODO: agregar spinner mientras procesa la info
    // enviar mensaje de exito!
  }

  updateEmployee(employee: Employee) {
    this.config.loading = true;
    this.employeesService
      .updateEmployee(employee)
      .subscribe((employee) => {
        this.saveForm.emit(employee);
        this.config.success = true;
      })
      .add(() => {
        this.config.loading = false;

        this.employeeForm.reset();
        this.closeRequest.emit();
      });
    // TODO: enviar mensaje de exito!
  }

  showPassword() {
    this.isHidenPassword.set(!this.isHidenPassword());
  }
}
