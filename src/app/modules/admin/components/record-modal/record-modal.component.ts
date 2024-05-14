import { Component, Input, SimpleChanges, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Record } from '../../../../models';
import { RecordService } from '../../../../services/record.service';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-record-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, DatePipe],
  templateUrl: './record-modal.component.html',
  styleUrl: './record-modal.component.scss',
})
export class RecordModalComponent {
  @Input() record: Record | undefined;

  fb = inject(FormBuilder);
  recordService = inject(RecordService);
  utilsService = inject(UtilsService);

  recordForm = this.fb.nonNullable.group({
    incidentAdmin: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.record) return;
    console.log(this.record);
    this.recordForm.reset({ incidentAdmin: this.record?.incidentAdmin });
  }

  onSubmit() {
    this.recordForm.markAllAsTouched();
    if (this.recordForm.invalid) return console.log('Invalid Form'); // agregar mensaje de error

    let dataForm = structuredClone(this.recordForm.value);

    if (!this.record?.id) return console.log('Error no existe record ID');

    this.recordService.updateRecordIncidentByAdmin(
      this.record.id,
      dataForm.incidentAdmin!
    );
  }
}
