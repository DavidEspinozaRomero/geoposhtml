import { Component, Input, SimpleChanges, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { Record } from '../../../../models';
import { RecordService } from '../../../../services/record.service';

@Component({
  selector: 'app-record-modal',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './record-modal.component.html',
  styleUrl: './record-modal.component.scss',
})
export class RecordModalComponent {
  @Input() record: Record | undefined;

  recordService = inject(RecordService);

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.record) return;
    console.log(this.record);
  }
}
