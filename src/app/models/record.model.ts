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
  geoStart: Geo;
  geoEnd?: Geo;
}

export interface Geo {
  accuracy: number;
  latitude: number;
  longitude: number;
  timestamp: number;
}
