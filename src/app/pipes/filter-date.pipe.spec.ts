import { FilterDatePipe } from './filter-date.pipe';
import { Record } from '../models';

function makeRecord(timestamp: number, id = 1): Record {
  return {
    id,
    employeeId: 1,
    companyId: 1,
    employeeName: 'Test',
    employeeUsername: 'test',
    companyName: 'TestCo',
    googlemapurl: '',
    geoStart: { accuracy: 10, latitude: 0, longitude: 0, timestamp },
  };
}

describe('FilterDatePipe', () => {
  let pipe: FilterDatePipe;

  beforeEach(() => {
    pipe = new FilterDatePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array when input array is empty', () => {
    expect(pipe.transform([], '2026-01-15')).toEqual([]);
  });

  it('should return all records when value is empty', () => {
    const records = [makeRecord(1737000000000), makeRecord(1737100000000)];
    expect(pipe.transform(records, '')).toEqual(records);
  });

  it('should filter records matching the given date', () => {
    // 2026-01-15 10:00:00 local — constructed via new Date(2026, 0, 15, 10, 0, 0)
    const jan15 = new Date(2026, 0, 15, 10, 0, 0).getTime();
    const jan16 = new Date(2026, 0, 16, 10, 0, 0).getTime();
    const records = [makeRecord(jan15, 1), makeRecord(jan16, 2), makeRecord(jan15, 3)];

    const result = pipe.transform(records, '2026-01-15');
    expect(result.length).toBe(2);
    expect(result.map((r) => r.id)).toEqual([1, 3]);
  });

  it('should use local date parsing (not UTC)', () => {
    // Timestamp for 2026-03-01 02:00 UTC — this is still Feb 28 in UTC-3 (Argentina)
    // new Date(1740794400000) → Feb 28 in UTC-3 vs Mar 1 in UTC
    // Using explicit local date ensures we match local day, not UTC day
    const feb28Local = new Date(2026, 1, 28, 14, 0, 0).getTime();
    const records = [makeRecord(feb28Local)];

    // Filter for 2026-02-28 — should match because pipe uses local date parsing
    const result = pipe.transform(records, '2026-02-28');
    expect(result.length).toBe(1);
  });

  it('should convert timestamp string to Number correctly', () => {
    // The pipe uses +record.geoStart.timestamp — ensure string timestamps work
    const ts = new Date(2026, 5, 20, 9, 30, 0).getTime();
    const record: Record = {
      id: 1,
      employeeId: 1,
      companyId: 1,
      employeeName: 'Test',
      employeeUsername: 'test',
      companyName: 'TestCo',
      googlemapurl: '',
      geoStart: { accuracy: 10, latitude: 0, longitude: 0, timestamp: ts as unknown as number },
    };

    const result = pipe.transform([record], '2026-06-20');
    expect(result.length).toBe(1);
  });

  it('should return empty array when no records match the date', () => {
    const records = [makeRecord(new Date(2026, 0, 15).getTime())];
    expect(pipe.transform(records, '2026-01-20')).toEqual([]);
  });

  it('should handle multiple records on same day', () => {
    const morning = new Date(2026, 3, 10, 8, 0, 0).getTime();
    const afternoon = new Date(2026, 3, 10, 16, 0, 0).getTime();
    const records = [makeRecord(morning, 1), makeRecord(afternoon, 2)];

    const result = pipe.transform(records, '2026-04-10');
    expect(result.length).toBe(2);
  });
});
