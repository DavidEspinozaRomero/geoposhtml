import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CalendarDay } from '../../../../models';
import { AppDialogComponent } from '../../../../shared/ui/dialog/dialog.component';
import { statusClasses } from '../../../../shared/ui/icon-map';

@Component({
  selector: 'app-calendary-modal',
  standalone: true,
  imports: [DatePipe, AppDialogComponent],
  templateUrl: './calendary-modal.component.html',
  styleUrl: './calendary-modal.component.scss',
})
export class CalendaryModalComponent {
  day = input<CalendarDay | null>(null);
  closeRequest = output<void>();

  isOpen = computed(() => this.day() !== null);
  readonly statusClasses = statusClasses;
}
