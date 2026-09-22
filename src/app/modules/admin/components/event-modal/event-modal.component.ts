import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideX } from '@lucide/angular';

import { EventsService } from '../../../../services';
import { CalendarEvent } from '../../../../models';
import { UtilsService } from '../../../../services/utils.service';
import { AppDialogComponent } from '../../../../shared/ui/dialog/dialog.component';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [ReactiveFormsModule, AppDialogComponent, LucideX],
  templateUrl: './event-modal.component.html',
  styleUrl: './event-modal.component.scss',
})
export class EventModalComponent implements OnInit {
  @Output() eventSubmit = new EventEmitter<CalendarEvent>();
  eventToEdit = input<CalendarEvent | undefined>();
  open = input(false);
  closeRequest = output<void>();
  isOpen = computed(() => this.open());

  fb = inject(FormBuilder);
  eventsService = inject(EventsService);
  utilsService = inject(UtilsService);

  eventTypes: { id: number; name: string }[] = [];

  eventForm = this.fb.nonNullable.group({
    id: [''],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(3)]],
    typeId: ['', [Validators.required]],
    date: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.eventsService.getEventTypes().subscribe((data) => {
      this.eventTypes = data;
    });
  }

  constructor() {
    effect(() => {
      if (this.eventToEdit()) {
        this.eventForm.reset(this.eventToEdit());
      } else {
        this.eventForm.reset();
      }
    });
  }

  createEvent(event: CalendarEvent) {
    this.eventsService.createEvent(event).subscribe((data: CalendarEvent) => {
      // agregar un emitter
      this.eventSubmit.emit(data);
    });
    this.eventForm.reset();
    this.closeRequest.emit();
  }

  updateEvent(event: CalendarEvent) {
    this.eventsService.updateEvent(event).subscribe((data: CalendarEvent) => {
      // agregar un emitter
      this.eventSubmit.emit(data);
    });
    this.eventForm.reset();
    this.closeRequest.emit();
  }

  onSubmit() {
    this.eventForm.markAllAsTouched();
    if (this.eventForm.invalid) return;
    const dataForm = structuredClone(this.eventForm.value);
    const event: CalendarEvent = {
      id: dataForm.id,
      title: dataForm.title!,
      eventType: {
        id: +dataForm.typeId!,
        name: this.eventTypes.find((type) => type.id === +dataForm.typeId!)?.name ?? '',
      },
      date: dataForm.date!,
      description: dataForm.description!,
    };
    if (!dataForm.id) {
      this.createEvent(event);
      return;
    }
    this.updateEvent(event);
  }
}
