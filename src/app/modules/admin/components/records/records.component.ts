import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import {
  EmployeesService,
  CompaniesService,
  RecordService,
} from '../../../../services';
import { Record, Company, Employee } from '../../../../models';
import {
  FilterDatePipe,
  FilterRecordEmployeeIncidentsPipe,
  FilterRecordEmployeeUsernamePipe,
} from '../../../../pipes';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [
    DatePipe,
    FilterDatePipe,
    FilterRecordEmployeeUsernamePipe,
    FilterRecordEmployeeIncidentsPipe,
  ],
  templateUrl: './records.component.html',
  styleUrl: './records.component.scss',
})
export class RecordsComponent implements OnInit {
  employeesService = inject(EmployeesService);
  companiesService = inject(CompaniesService);
  recordService = inject(RecordService);

  records: Record[] = [];
  employees: Employee[] = [];
  companies: Company[] = [];

  constructor() {}

  ngOnInit(): void {
    this.recordService.getRecords().subscribe((records) => {
      records.forEach((record: Record) => {
        this.employeesService
          .getEmployeeById(record.employeeId)
          .subscribe((employee) => {
            record.employeeName = employee.name;
            record.employeeUsername = employee.username;
          });
        this.companiesService
          .getCompanyById(record.companyId)
          .subscribe((company) => {
            record.companyName = company.name;
          });
      });
      this.records = records;
    });
  }

  // agregar incidencia por parte del admin
}
