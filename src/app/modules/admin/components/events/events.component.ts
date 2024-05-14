import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';

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
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  eventsService = inject(EventsService);

  // today = new Date();
  events: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | undefined;

  ngOnInit(): void {
    this.initApis();
  }

  initApis() {
    this.eventsService.getEvents().subscribe((events) => {
      events.forEach((event: CalendarEvent) => {
        // dependiendo el tipo de evento se le asigna un color
        switch (event.typeId) {
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
      });
      this.events = events;
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
    this.eventsService.createEvent(event).subscribe((data: CalendarEvent) => {
      this.events.unshift(data);
      // this.events.push(data);
    });
  }

  updateEvent(event: CalendarEvent) {
    this.eventsService.updateEvent(event).subscribe((data: CalendarEvent) => {
      const idx = this.events.findIndex((event) => event.id === data.id);
      if (idx !== -1) {
        this.events.splice(idx, 1, data);
      }
    });
  }

  deleteEvent(event: CalendarEvent, i_event: number) {
    // this.eventsService
    //   .deleteEvent(event)
    //   .subscribe((data: CalendarEvent) => {
    //   });
    this.events.splice(i_event, 1);
  }
}
