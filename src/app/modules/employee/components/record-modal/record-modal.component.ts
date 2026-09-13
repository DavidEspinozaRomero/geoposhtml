import { Component, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucideInfo, LucideMapPin, LucideX } from '@lucide/angular';

import { Record } from '../../../../models';
import { UtilsService } from '../../../../services/utils.service';
import { AppDialogComponent } from '../../../../shared/ui/dialog/dialog.component';

@Component({
  selector: 'app-record-modal',
  standalone: true,
  imports: [DatePipe, LucideInfo, LucideMapPin, LucideX, AppDialogComponent],
  templateUrl: './record-modal.component.html',
  styleUrl: './record-modal.component.scss',
})
export class RecordModalComponent {
  record = input<Record | undefined>();
  closeRequest = output<void>();
  isOpen = computed(() => this.record() !== undefined);

  utilsService = inject(UtilsService);

  getGoogleMapUrl(geo: { latitude: number; longitude: number }): string {
    return this.utilsService.getGoogleMapUrl(geo);
  }
}
