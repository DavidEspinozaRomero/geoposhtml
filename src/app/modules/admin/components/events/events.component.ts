import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { LucidePencil, LucideTrash2 } from '@lucide/angular';

import { EventsService } from '../../../../services';
import { CalendarEvent } from '../../../../models';
import {
  FilterByEventDatePipe,
  FilterByEventTitlePipe,
  FilterByEventTypePipe,
} from '../../../../pipes';
import { EventModalComponent } from '../event-modal/event-modal.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    DatePipe,
    UpperCasePipe,
    FilterByEventDatePipe,
    FilterByEventTitlePipe,
    FilterByEventTypePipe,
    EventModalComponent,
    LucidePencil,
    LucideTrash2,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  eventsService = inject(EventsService);
  events = signal<CalendarEvent[]>([]);
  eventTypes = signal<{ id: number; name: string }[]>([]);
  selectedEvent = signal<CalendarEvent | undefined>(undefined);

  ngOnInit(): void {
    this.initApis();
  }

  initApis() {
    this.eventsService.getEvents().subscribe({
      next: (events) => {
        const mapped = events.map((event: CalendarEvent) => {
          switch (event.eventType?.id) {
            case 1:
              event.class = 'text-bg-primary';
              break;
            case 2:
              event.class = 'text-bg-success';
              break;
            case 3:
              event.class = 'text-bg-danger';
              break;
            case 4:
              event.class = 'text-bg-warning';
              break;
            default:
              event.class = 'text-bg-info';
              break;
          }
          return event;
        });
        this.events.set(mapped);
      },
    });

    this.eventsService.getEventTypes().subscribe({
      next: (types) => {
        this.eventTypes.set(types);
      },
    });
  }

  checkEvent(event: CalendarEvent) {
    if (!event.id) {
      this.createEvent(event);
      return;
    }
    this.updateEvent(event);
  }

  createEvent(event: CalendarEvent) {
    this.eventsService.createEvent(event).subscribe({
      next: (data: CalendarEvent) => {
        this.events.update((evs) => [data, ...evs]);
      },
    });
  }

  updateEvent(event: CalendarEvent) {
    this.eventsService.updateEvent(event).subscribe({
      next: (data: CalendarEvent) => {
        this.events.update((evs) => evs.map((e) => (e.id === data.id ? data : e)));
      },
    });
  }

  deleteEvent(event: CalendarEvent, i_event: number) {
    this.eventsService.deleteEvent(event).subscribe({
      next: () => {
        this.events.update((evs) => {
          const copy = [...evs];
          copy.splice(i_event, 1);
          return copy;
        });
      },
    });
  }
}
