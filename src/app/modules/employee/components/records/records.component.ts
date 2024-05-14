import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import {
  EmployeesService,
  CompaniesService,
  RecordService,
  UtilsService,
} from '../../../../services';
import { Record, Company, Employee } from '../../../../models';
import {
  FilterDatePipe,
  FilterRecordEmployeeIncidentsPipe,
} from '../../../../pipes';
import { RecordModalComponent } from '../record-modal/record-modal.component';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [
    DatePipe,
    FilterDatePipe,
    FilterRecordEmployeeIncidentsPipe,
    RecordModalComponent,
  ],
  templateUrl: './records.component.html',
  styleUrl: './records.component.scss',
})
export class RecordsComponent implements OnInit {
  employeesService = inject(EmployeesService);
  companiesService = inject(CompaniesService);
  recordService = inject(RecordService);
  utilsService = inject(UtilsService);

  records: Record[] = [];
  selectedRecord: Record | undefined;
  employees: Employee[] = [];
  companies: Company[] = [];

  constructor() {}

  ngOnInit(): void {
    this.recordService.getRecordsByEmployee().subscribe((records) => {
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
}
