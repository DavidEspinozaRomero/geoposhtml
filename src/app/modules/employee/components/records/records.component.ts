import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { LucideEye, LucideUser, LucideUserCog } from '@lucide/angular';

import { RecordService } from '../../../../services/record.service';
import { Record } from '../../../../models';
import { FilterDatePipe, FilterRecordEmployeeIncidentsPipe } from '../../../../pipes';
import { RecordModalComponent } from '../record-modal/record-modal.component';
import { Auth } from '../../../../services/auth';
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
    FilterRecordEmployeeIncidentsPipe,
    RecordModalComponent,
    LucideEye,
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
})
export class RecordsComponent implements OnInit {
  auth = inject(Auth);
  recordService = inject(RecordService);

  records = signal<Record[]>([]);
  selectedRecord = signal<Record | undefined>(undefined);

  ngOnInit(): void {
    const employeeId = this.auth.currentUser?.employeeId;
    if (!employeeId) return;

    this.recordService.getRecordsByEmployee(employeeId).subscribe({
      next: (records) => this.records.set(records),
    });
  }
}
