import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EventModalComponent } from './event-modal.component';
import { EventsService } from '../../../../services';
import { CalendarEvent } from '../../../../models';

describe('EventModalComponent', () => {
  let component: EventModalComponent;
  let fixture: ComponentFixture<EventModalComponent>;

  const EVENT: CalendarEvent = {
    id: 'evt-1',
    title: 'Reunion',
    description: 'Reunion de equipo',
    date: '2026-09-22',
    eventType: { id: 1, name: 'Reunion' },
  };

  const eventsServiceMock = {
    getEventTypes: () => of([{ id: 1, name: 'Reunion' }]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventModalComponent],
      providers: [{ provide: EventsService, useValue: eventsServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(EventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stay closed while the open input is false', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should open when the open input flips to true (create mode)', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
  });

  it('should reset the form with the event values when an event is provided (edit mode)', async () => {
    fixture.componentRef.setInput('eventToEdit', EVENT);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.eventForm.value.title).toBe('Reunion');
    expect(component.eventForm.value.id).toBe('evt-1');
  });

  it('should reset the form to empty when the event is cleared (close)', async () => {
    fixture.componentRef.setInput('eventToEdit', EVENT);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.eventForm.value.title).toBe('Reunion');

    fixture.componentRef.setInput('eventToEdit', undefined);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.eventForm.value.title).toBe('');
    expect(component.eventForm.value.id).toBe('');
  });
});
