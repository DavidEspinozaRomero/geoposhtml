import { Component, Input, SimpleChanges, inject, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Record } from '../../../../models';
import { RecordService } from '../../../../services/record.service';

@Component({
  selector: 'app-record-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './record-modal.component.html',
  styleUrl: './record-modal.component.scss',
})
export class RecordModalComponent implements OnChanges {
  @Input() record: Record | undefined;

  recordService = inject(RecordService);

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.record) return;
  }
}
