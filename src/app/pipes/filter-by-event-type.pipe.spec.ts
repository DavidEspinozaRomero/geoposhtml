import { FilterByEventTypePipe } from './filter-by-event-type.pipe';
import { CalendarEvent } from '../models';

function makeEvent(typeId: number, typeName: string, title = 'Test'): CalendarEvent {
  return { date: '2026-01-15', title, description: '', eventType: { id: typeId, name: typeName } };
}

describe('FilterByEventTypePipe', () => {
  let pipe: FilterByEventTypePipe;

  beforeEach(() => {
    pipe = new FilterByEventTypePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array when input array is empty', () => {
    expect(pipe.transform([], '1')).toEqual([]);
  });

  it('should return all events when value is empty', () => {
    const events = [makeEvent(1, 'Permiso'), makeEvent(2, 'Licencia')];
    expect(pipe.transform(events, '')).toEqual(events);
  });

  it('should filter events by eventType.id', () => {
    const events = [
      makeEvent(1, 'Permiso', 'Permiso maternidad'),
      makeEvent(2, 'Licencia', 'Licencia anual'),
      makeEvent(1, 'Permiso', 'Permiso médico'),
    ];

    const result = pipe.transform(events, '1');
    expect(result.length).toBe(2);
    expect(result.every((e) => e.eventType.id === 1)).toBe(true);
    expect(result.map((e) => e.title)).toEqual(['Permiso maternidad', 'Permiso médico']);
  });

  it('should handle string value by converting to number with +value', () => {
    const events = [makeEvent(3, 'Feriado')];
    const result = pipe.transform(events, '3');
    expect(result.length).toBe(1);
  });

  it('should return empty when no events match the type', () => {
    const events = [makeEvent(1, 'Permiso')];
    expect(pipe.transform(events, '99')).toEqual([]);
  });

  it('should handle events with eventType that does not match', () => {
    const events: CalendarEvent[] = [
      makeEvent(5, 'Feriado', 'Día feriado'),
      makeEvent(1, 'Permiso', 'Permiso médico'),
      makeEvent(99, 'Otro', 'Algo raro'),
    ];

    const result = pipe.transform(events, '1');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Permiso médico');
  });
});
