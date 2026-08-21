import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { EmployeesService, CompaniesService, RecordService } from '../../../../services';
import { Record } from '../../../../models';
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
  private readonly cdr = inject(ChangeDetectorRef);

  records: Record[] = [];
  selectedRecord: Record | undefined;
  // employees: Employee[] = [];
  // companies: Company[] = [];

  ngOnInit(): void {
    this.recordService
      .getRecords()
      .subscribe((records) => {
        this.records = records;
        //   this.employeesService
        //     .getEmployeeById(record.employeeId)
        //     .subscribe((employee) => {
        //       record.employeeName = employee.name;
        //       record.employeeUsername = employee.username;
        //     });
        //   this.companiesService
        //     .getCompanyById(record.companyId)
        //     .subscribe((company) => {
        //       record.companyName = company.name;
        //     });
        // });
        this.records = records;
      })
      .add(() => {
        this.cdr.detectChanges();
      });
  }
}
