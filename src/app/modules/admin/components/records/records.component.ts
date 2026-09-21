import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { LucideInfo, LucideMapPin, LucidePencil, LucideUser, LucideUserCog } from '@lucide/angular';

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
import {
  AppBtnDirective,
  AppInputDirective,
  AppSelectDirective,
  AppTableDirective,
  AppTdDirective,
  AppThDirective,
  AppTrBodyDirective,
  AppTrHeadDirective,
} from '../../../../shared/ui';

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
    LucideInfo,
    LucideMapPin,
    LucidePencil,
    LucideUser,
    LucideUserCog,
    AppBtnDirective,
    AppInputDirective,
    AppSelectDirective,
    AppTableDirective,
    AppTdDirective,
    AppThDirective,
    AppTrBodyDirective,
    AppTrHeadDirective,
  ],
  templateUrl: './records.component.html',
  styleUrl: './records.component.scss',
})
export class RecordsComponent implements OnInit {
  employeesService = inject(EmployeesService);
  companiesService = inject(CompaniesService);
  recordService = inject(RecordService);
  utilsService = inject(UtilsService);

  records = signal<Record[]>([]);
  selectedRecord = signal<Record | undefined>(undefined);
  recordsOpen = signal(false);

  ngOnInit(): void {
    this.recordService.getRecords().subscribe({
      next: (records) => {
        this.records.set(records);
      },
    });
  }
}
