import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  UtilsService,
  EmployeesService,
  CompaniesService,
  RecordService,
} from '../../../../services';
import { JsonPipe, NgClass } from '@angular/common';
import { Company, Employee } from '../../../../models';

@Component({
  selector: 'app-records-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, JsonPipe],
  templateUrl: './records-modal.component.html',
  styleUrl: './records-modal.component.scss',
})
export class RecordsModalComponent implements OnInit {
  fb = inject(FormBuilder);
  recordService = inject(RecordService);
  employeesService = inject(EmployeesService);
  companiesService = inject(CompaniesService);
  utilsService = inject(UtilsService);

  employees: Employee[] = [];
  companies: Company[] = [];

  recordsForm = this.fb.nonNullable.group({
    companyId: ['', []],
    employeeId: ['', []],
    date: ['', []],
    incidentAdmin: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {
    this.getInitData();
  }
  getInitData() {
    this.employeesService
      .getEmployees()
      .subscribe((employees) => (this.employees = employees));
    this.companiesService
      .getCompanies()
      .subscribe((companies) => (this.companies = companies));
  }

  onSubmit() {
    this.recordsForm.markAllAsTouched();
    if (this.recordsForm.invalid) return console.log('Invalid Form'); // agregar mensaje de error

    let dataForm = structuredClone(this.recordsForm.value);
    console.log(dataForm);
    this.recordService.updateRecordsIncidentByAdmin(dataForm);
  }
}
