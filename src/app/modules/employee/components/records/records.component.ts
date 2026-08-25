import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';

import { RecordService } from '../../../../services/record.service';
import { Record } from '../../../../models';
import { FilterDatePipe, FilterRecordEmployeeIncidentsPipe } from '../../../../pipes';
import { RecordModalComponent } from '../record-modal/record-modal.component';
import { Auth } from '../../../../services/auth';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [DatePipe, FilterDatePipe, FilterRecordEmployeeIncidentsPipe, RecordModalComponent],
  templateUrl: './records.component.html',
  styleUrl: './records.component.scss',
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
