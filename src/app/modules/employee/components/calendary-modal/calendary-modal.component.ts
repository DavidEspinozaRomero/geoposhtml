import { Component, Input } from '@angular/core';
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
  @Input() day: CalendarDay | null = null;

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
