import { DatePipe } from '@angular/common';
import { Component, OnChanges, SimpleChanges, computed, inject, input, output } from '@angular/core';

import { EventsService } from '../../../../services/events.service';
import { CalendarEvent } from '../../../../models';
import { AppDialogComponent } from '../../../../shared/ui/dialog/dialog.component';

@Component({
  selector: 'app-events-modal',
  standalone: true,
  imports: [DatePipe, AppDialogComponent],
  templateUrl: './events-modal.component.html',
  styleUrl: './events-modal.component.scss',
})
export class EventsModalComponent implements OnChanges {
  config = input<{ date: string; typeEvent: number }>();
  closeRequest = output<void>();
  isOpen = computed(() => this.config() !== undefined);
  // {Date, type}
  eventsService = inject(EventsService);

  day = new Date();

  events: CalendarEvent[] = [];

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.config()) return;

    const [year, month, day] = (this.config()?.date ?? '').split('-').map(Number);
    this.day = new Date(year, month - 1, day);
    this.getEventsByDay();
  }

  getEventsByDay() {
    this.eventsService.getAllEventsByDay(this.config()!.date).subscribe((events) => {
      this.events = events;
    });
  }
}
