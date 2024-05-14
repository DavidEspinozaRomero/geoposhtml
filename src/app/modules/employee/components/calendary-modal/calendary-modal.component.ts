import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CalendarEvent } from '../../../../models';
import { EventsService } from '../../../../services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendary-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './calendary-modal.component.html',
  styleUrl: './calendary-modal.component.scss',
})
export class CalendaryModalComponent implements OnChanges {
  @Input() config?: { date: string; typeEvent: number };
  // {Date, type}
  eventsService = inject(EventsService);

  day = new Date();

  events: CalendarEvent[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.config) return;
    console.log(this.config);

    this.day = new Date(this.config?.date + ':');
    this.getEventsByDay();
  }

  getEventsByDay() {
    this.eventsService
      .getAllEventsByDay(this.config!.date)
      .subscribe((events) => {
        console.log(events);
        this.events = events;
      });
  }
}
