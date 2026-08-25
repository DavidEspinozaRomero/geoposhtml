import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';

import { EventsService } from '../../../../services/events.service';
import { CalendarEvent } from '../../../../models';

@Component({
  selector: 'app-events-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './events-modal.component.html',
  styleUrl: './events-modal.component.scss',
})
export class EventsModalComponent implements OnChanges {
  @Input() config?: { date: string; typeEvent: number };
  // {Date, type}
  eventsService = inject(EventsService);

  day = new Date();

  events: CalendarEvent[] = [];

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.config) return;

    const [year, month, day] = (this.config?.date ?? '').split('-').map(Number);
    this.day = new Date(year, month - 1, day);
    this.getEventsByDay();
  }

  getEventsByDay() {
    this.eventsService.getAllEventsByDay(this.config!.date).subscribe((events) => {
      this.events = events;
    });
  }
}
