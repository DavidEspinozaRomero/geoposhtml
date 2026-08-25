import { FilterByEventDatePipe } from './filter-by-event-date.pipe';
import { CalendarEvent } from '../models';

function makeEvent(date: string, title = 'Test'): CalendarEvent {
  return { date, title, description: '', eventType: { id: 1, name: 'Test' } };
}

describe('FilterByEventDatePipe', () => {
  let pipe: FilterByEventDatePipe;

  beforeEach(() => {
    pipe = new FilterByEventDatePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array when input array is empty', () => {
    expect(pipe.transform([], '2026-01-15')).toEqual([]);
  });

  it('should return all events when value is empty', () => {
    const events = [makeEvent('2026-01-15'), makeEvent('2026-01-16')];
    expect(pipe.transform(events, '')).toEqual(events);
  });

  it('should filter events by exact date string', () => {
    const events = [
      makeEvent('2026-01-15', 'Evento A'),
      makeEvent('2026-01-16', 'Evento B'),
      makeEvent('2026-01-15', 'Evento C'),
    ];

    const result = pipe.transform(events, '2026-01-15');
    expect(result.length).toBe(2);
    expect(result.map((e) => e.title)).toEqual(['Evento A', 'Evento C']);
  });

  it('should return empty when no events match the date', () => {
    const events = [makeEvent('2026-01-15')];
    expect(pipe.transform(events, '2026-01-20')).toEqual([]);
  });

  it('should use strict string equality (no colon bug)', () => {
    // The pipe compares event.date === value directly
    // Ensure "2026-01-15" !== "2026-01-15:" (the old colon bug)
    const events = [makeEvent('2026-01-15')];
    expect(pipe.transform(events, '2026-01-15:').length).toBe(0);
    expect(pipe.transform(events, '2026-01-15').length).toBe(1);
  });
});
