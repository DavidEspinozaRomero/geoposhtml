import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucideX } from '@lucide/angular';

import { CalendarDay } from '../../../../models';
import { AppDialogComponent } from '../../../../shared/ui/dialog/dialog.component';
import { statusVariant } from '../../../../shared/ui/icon-map';
import { AppBadgeDirective } from '../../../../shared/ui';

@Component({
  selector: 'app-calendary-modal',
  standalone: true,
  imports: [DatePipe, LucideX, AppDialogComponent, AppBadgeDirective],
  templateUrl: './calendary-modal.component.html',
})
export class CalendaryModalComponent {
  day = input<CalendarDay | null>(null);
  closeRequest = output<void>();

  isOpen = computed(() => this.day() !== null);
  readonly statusVariant = statusVariant;
}
