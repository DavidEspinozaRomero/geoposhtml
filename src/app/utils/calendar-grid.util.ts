import { CalendarDay } from '../models';

/**
 * Arrange a flat list of days (one per calendar day, already ordered by date)
 * into a month grid of weeks. Each week is an array of 7 slots (Mon..Sun).
 * Missing days are filled with `null` so the grid aligns to week columns.
 *
 * Backend dayOfWeek: 1=Mon ... 7=Sun.
 */
export function buildMonthGrid(days: CalendarDay[]): (CalendarDay | null)[][] {
  if (days.length === 0) return [];

  const weeks: (CalendarDay | null)[][] = [];
  let currentWeek: (CalendarDay | null)[] = [];

  const pushWeek = () => {
    if (currentWeek.length > 0) {
      // pad the week to 7 columns (Mon..Sun)
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
      currentWeek = [];
    }
  };

  for (const day of days) {
    // backend dayOfWeek 1=Mon -> index 0
    const colIndex = day.dayOfWeek - 1;

    // if this day belongs to a new week (colIndex <= last week's last column)
    if (currentWeek.length > 0 && colIndex <= currentWeek.length - 1) {
      pushWeek();
    }

    // fill empty leading slots with null
    while (currentWeek.length < colIndex) currentWeek.push(null);
    currentWeek.push(day);
  }

  pushWeek();

  return weeks;
}
