export interface Record {
  id?: string;
  employeeId: string;
  companyId: string;
  employeeName: string;
  employeeUsername: string;
  companyName: string;
  startTimestamp: number;
  endTimestamp: number;
  incidencia: string;
  incidenciaAdmin: string;
  googlemapurl: string;
  geo: Geo;
}

export interface Geo {
  accuracy: number;
  latitude: number;
  longitude: number;
}
