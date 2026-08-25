export type DayStatus = 'complete' | 'partial' | 'absent' | 'rest' | 'event';

export interface CalendarRecord {
  id: number;
  checkIn: string;
  checkOut: string | null;
  incident: string | null;
  isActive: boolean;
}

export interface CalendarWorkday {
  id: number;
  day: number;
}

export interface CalendarMonthEvent {
  id: number;
  title: string;
  eventType: { id: number; name: string };
}

export interface CalendarDay {
  date: string;
  dayOfWeek: number;
  workday: CalendarWorkday | null;
  records: CalendarRecord[];
  events: CalendarMonthEvent[];
  status: DayStatus;
}

export interface CalendarEmployee {
  id: number;
  name: string;
  username: string;
}

export interface CalendarMonthTeamResponse {
  month: string;
  employees: {
    employee: CalendarEmployee;
    days: CalendarDay[];
  }[];
}

export interface CalendarMonthEmployeeResponse {
  month: string;
  employeeId: number;
  days: CalendarDay[];
}

export type CalendarMonthResponse = CalendarMonthTeamResponse | CalendarMonthEmployeeResponse;

/** @deprecated Use CalendarMonthEvent or the new CalendarDay types instead */
export interface Calendar {
  date: string;
  eventTypeIds: number[];
}
