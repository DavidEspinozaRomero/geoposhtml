import { CalendarDay } from '../models';
import { buildMonthGrid } from './calendar-grid.util';

describe('buildMonthGrid', () => {
  it('returns empty array for empty days', () => {
    expect(buildMonthGrid([])).toEqual([]);
  });

  it('builds a single week of 7 columns when days fit one week', () => {
    const days: CalendarDay[] = [
      { date: '2026-08-03', dayOfWeek: 1, workday: null, records: [], events: [], status: 'rest' },
      { date: '2026-08-04', dayOfWeek: 2, workday: null, records: [], events: [], status: 'rest' },
      { date: '2026-08-05', dayOfWeek: 3, workday: null, records: [], events: [], status: 'rest' },
      { date: '2026-08-06', dayOfWeek: 4, workday: null, records: [], events: [], status: 'rest' },
      { date: '2026-08-07', dayOfWeek: 5, workday: null, records: [], events: [], status: 'rest' },
      { date: '2026-08-08', dayOfWeek: 6, workday: null, records: [], events: [], status: 'rest' },
      { date: '2026-08-09', dayOfWeek: 7, workday: null, records: [], events: [], status: 'rest' },
    ];

    const weeks = buildMonthGrid(days);
    expect(weeks.length).toBe(1);
    expect(weeks[0].length).toBe(7);
    // all real days, no nulls
    expect(weeks[0].every((d) => d !== null)).toBe(true);
    expect(weeks[0][0]!.date).toBe('2026-08-03');
    expect(weeks[0][6]!.date).toBe('2026-08-09');
  });

  it('pads leading days with null when week does not start on Monday', () => {
    const days: CalendarDay[] = [
      { date: '2026-08-05', dayOfWeek: 3, workday: null, records: [], events: [], status: 'rest' },
    ];

    const weeks = buildMonthGrid(days);
    expect(weeks.length).toBe(1);
    expect(weeks[0].length).toBe(7);
    // index 0,1 are null (Mon, Tue), index 2 is the day (Wed)
    expect(weeks[0][0]).toBeNull();
    expect(weeks[0][1]).toBeNull();
    expect(weeks[0][2]!.date).toBe('2026-08-05');
    expect(weeks[0][3]).toBeNull();
    expect(weeks[0][4]).toBeNull();
    expect(weeks[0][5]).toBeNull();
    expect(weeks[0][6]).toBeNull();
  });

  it('splits days into multiple weeks when they wrap', () => {
    // Sat then next Mon => two weeks
    const days: CalendarDay[] = [
      { date: '2026-08-01', dayOfWeek: 6, workday: null, records: [], events: [], status: 'rest' },
      { date: '2026-08-03', dayOfWeek: 1, workday: null, records: [], events: [], status: 'rest' },
    ];

    const weeks = buildMonthGrid(days);
    expect(weeks.length).toBe(2);
    expect(weeks[0].length).toBe(7);
    expect(weeks[1].length).toBe(7);
    expect(weeks[0][5]!.date).toBe('2026-08-01');
    expect(weeks[0][6]).toBeNull();
    expect(weeks[1][0]!.date).toBe('2026-08-03');
  });
});
