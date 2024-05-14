export interface Record {
  id: string;
  employeeId: string;
  companyId: string;
  employeeName: string;
  employeeUsername: string;
  companyName: string;
  startTimestamp: number;
  endTimestamp: number;
  duration?: number;
  incident: string;
  incidentAdmin: string;
  googlemapurl: string;
  geoStart: Geo;
  geoEnd: Geo;
  isActive?: boolean;
}

export interface Geo {
  accuracy: number;
  latitude: number;
  longitude: number;
}
