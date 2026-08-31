import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CalendarDay } from '../../../../models';

@Component({
  selector: 'app-calendary-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './calendary-modal.component.html',
  styleUrl: './calendary-modal.component.scss',
})
export class CalendaryModalComponent {
  day = input<CalendarDay | null>(null);
  closeRequest = output<void>();

  isOpen = computed(() => this.day() !== null);

  statusColor(status: string): string {
    const map: Record<string, string> = {
      complete: 'success',
      partial: 'warning',
      absent: 'danger',
      rest: 'secondary',
      event: 'info',
    };
    return map[status] ?? 'secondary';
  }
}
