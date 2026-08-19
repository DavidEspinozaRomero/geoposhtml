import {
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
  inject,
  OnChanges,
} from '@angular/core';
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
export class RecordModalComponent implements OnChanges {
  @Input() record: Record | undefined;
  @ViewChild('btnClose') btnClose!: ElementRef<HTMLButtonElement>;

  fb = inject(FormBuilder);
  recordService = inject(RecordService);
  utilsService = inject(UtilsService);

  recordForm = this.fb.nonNullable.group({
    incidentAdmin: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.record) return;
    this.recordForm.reset({ incidentAdmin: this.record?.incidentAdmin });
  }

  onSubmit() {
    this.recordForm.markAllAsTouched();
    if (this.recordForm.invalid) return;
    // agregar loader
    const dataForm = structuredClone(this.recordForm.value);

    if (!this.record?.id) return;

    this.recordService
      .updateRecordIncidentByAdmin(this.record.id, dataForm.incidentAdmin!)
      .subscribe(() => {
        this.record!.incidentAdmin = dataForm.incidentAdmin;
      })
      .add(() => {
        this.btnClose.nativeElement.click();
      }); // agregar loader
  }
}
