import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  viewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { EventsService } from '../../../../services';
import { CalendarEvent } from '../../../../models';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './event-modal.component.html',
  styleUrl: './event-modal.component.scss',
})
export class EventModalComponent implements OnInit, OnChanges {
  @Output() eventSubmit = new EventEmitter<CalendarEvent>();
  // @Input() eventToEdit: CalendarEvent | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() eventToEdit: any;
  btnClose = viewChild<ElementRef<HTMLButtonElement>>('btnClose');

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
  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.eventToEdit) return;
    this.eventForm.reset(this.eventToEdit);
  }

  createEvent(event: CalendarEvent) {
    this.eventsService.createEvent(event).subscribe((data: CalendarEvent) => {
      // agregar un emitter
      this.eventSubmit.emit(data);
    });
    this.eventForm.reset();
    this.btnClose()?.nativeElement.click();
  }

  updateEvent(event: CalendarEvent) {
    this.eventsService.updateEvent(event).subscribe((data: CalendarEvent) => {
      // agregar un emitter
      this.eventSubmit.emit(data);
    });
    this.eventForm.reset();
    this.btnClose()?.nativeElement.click();
  }

  onSubmit() {
    this.eventForm.markAllAsTouched();
    if (this.eventForm.invalid) return;
    const dataForm = structuredClone(this.eventForm.value);
    const event: CalendarEvent = {
      id: dataForm.id,
      title: dataForm.title!,
      type: this.eventTypes.find((type) => type.id === +dataForm.typeId!)?.name ?? '',
      typeId: +dataForm.typeId!,
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
