export interface CalendarEvent {
  id?: string;
  typeId: number;
  date: string;
  type: string;
  title: string;
  description: string;
  class?: string;
}
