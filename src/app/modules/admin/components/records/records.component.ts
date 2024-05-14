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
import { RecordModalComponent } from '../record-modal/record-modal.component';
import { RecordsModalComponent } from '../records-modal/records-modal.component';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [
    DatePipe,
    FilterDatePipe,
    FilterRecordEmployeeUsernamePipe,
    FilterRecordEmployeeIncidentsPipe,
    RecordModalComponent,
    RecordsModalComponent,
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
}
