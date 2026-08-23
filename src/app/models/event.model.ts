export interface CalendarEvent {
  id?: string;
  date: string;
  title: string;
  description: string;
  eventType: { id: number; name: string };
  class?: string;
}
