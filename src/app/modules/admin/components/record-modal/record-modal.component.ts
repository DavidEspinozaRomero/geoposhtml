import {
  Component,
  SimpleChanges,
  computed,
  inject,
  input,
  OnChanges,
  output,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideX } from '@lucide/angular';

import { Record } from '../../../../models';
import { RecordService } from '../../../../services/record.service';
import { UtilsService } from '../../../../services/utils.service';
import { AppDialogComponent } from '../../../../shared/ui/dialog/dialog.component';
import { AppBtnDirective, AppInputDirective } from '../../../../shared/ui';

@Component({
  selector: 'app-record-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    AppDialogComponent,
    LucideX,
    AppBtnDirective,
    AppInputDirective,
  ],
  templateUrl: './record-modal.component.html',
  styleUrl: './record-modal.component.scss',
})
export class RecordModalComponent implements OnChanges {
  record = input<Record | undefined>();
  open = input(false);
  closeRequest = output<void>();
  isOpen = computed(() => this.open());

  fb = inject(FormBuilder);
  recordService = inject(RecordService);
  utilsService = inject(UtilsService);

  recordForm = this.fb.nonNullable.group({
    incidentAdmin: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.record()) return;
    this.recordForm.reset({ incidentAdmin: this.record()?.incidentAdmin });
  }

  onSubmit() {
    this.recordForm.markAllAsTouched();
    if (this.recordForm.invalid) return;
    // agregar loader
    const dataForm = structuredClone(this.recordForm.value);

    if (!this.record()?.id) return;

    this.recordService
      .updateRecordIncidentByAdmin(this.record()!.id, dataForm.incidentAdmin!)
      .subscribe(() => {
        this.record()!.incidentAdmin = dataForm.incidentAdmin;
      })
      .add(() => {
        this.closeRequest.emit();
      }); // agregar loader
  }
}
