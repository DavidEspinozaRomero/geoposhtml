export interface CalendarEvent {
  id?: string;
  date: string;
  title: string;
  description: string;
  eventType: { id: number; name: string };
  class?: string;
}

export interface EventType {
  id: number;
  name: string;
  severity: string;
}
