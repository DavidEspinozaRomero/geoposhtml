import { DatePipe, JsonPipe } from '@angular/common';
import {
  Component,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';

import { Calendar } from '../../../../models';
import { EventsService } from '../../../../services';
import { CalendaryModalComponent } from '../calendary-modal/calendary-modal.component';

@Component({
  selector: 'app-calendary',
  standalone: true,
  imports: [DatePipe, JsonPipe, CalendaryModalComponent],
  templateUrl: './calendary.component.html',
  styleUrl: './calendary.component.scss',
})
export class CalendaryComponent {
  eventsService = inject(EventsService);

  // today = signal<Date>(new Date());
  now = signal<Date>(new Date());
  year = computed(() => this.now().getFullYear());
  month = computed(() => this.now().getMonth()); // 0-11
  // day = this.today().getDate();
  monthDays = computed(() =>
    new Date(this.year(), this.month() + 1, 0).getDate()
  );
  calendarDays = computed(() => Array(this.monthDays()));

  calendarEvents: Calendar[] = [];
  modalConfig: { date: string; typeEvent: number } | undefined;

  constructor() {}

  ngOnInit(): void {
    this.eventsService
      .getEventsOfCalendarByEmployee(new Date())
      .subscribe((calendarEvents: Calendar[]) => {
        this.calendarEvents = calendarEvents;
      })
      .add(() => {
        // agregar loader
      });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  getDateSelected(day: number) {
    const date = new Date(this.year(), this.month(), day + 1);
    return date;
  }

  getIconbyEvent(day: number) {
    const calendarDay = day + 1;
    const currentDay = this.calendarEvents.find((day) => {
      return new Date(day.date + ':').getDate() === calendarDay;
    });
    return currentDay;
  }

  fillConfig(year: number, month: number, day: number, typeEvent: number) {
    const date = new Date(year, month, day + 1).toJSON().slice(0, 10);
    this.modalConfig = { date, typeEvent };
  }

  changeMonth(quantity: number) {
    this.now.update((d) => new Date(d.getFullYear(), d.getMonth() + quantity));
    this.eventsService
      .getEventsOfCalendar(new Date())
      .subscribe((calendarEvents: Calendar[]) => {
        this.calendarEvents = calendarEvents;
      })
      .add(() => {
        // agregar loader
      });
  }
}
