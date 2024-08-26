export interface Record {
  id: number;
  employeeId: number;
  companyId: number;
  employeeName: string;
  employeeUsername: string;
  companyName: string;
  duration?: number;
  incident?: string;
  incidentAdmin?: string;
  googlemapurl: string;
  isActive?: boolean;
  // geoStart: Geo;
  // geoEnd?: Geo;
  startAccuracy: number;
  startLatitude: number;
  startLongitude: number;
  startTimestamp: number;
  endAccuracy?: number;
  endLatitude?: number;
  endLongitude?: number;
  endTimestamp?: number;
}

export interface Geo {
  accuracy: number;
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface ResponseRecord {
  id: number;
  incident: string;
  incidentAdmin: string;
  isActive: true;
  startAccuracy: number;
  startLatitude: number;
  startLongitude: number;
  startTimestamp: string;
  endAccuracy: number;
  endLatitude: number;
  endLongitude: number;
  endTimestamp: number;
  employee: {
    id: number;
  };
  company: {
    id: number;
  };
  companyName: string;
}
