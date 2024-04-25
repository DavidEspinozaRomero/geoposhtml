export interface Employee {
  id?: string;
  name: string;
  username: string;
  password: string;
  email: string;
  dni: string;
  address: string;
  phone: string;
  isActive: boolean;
  insurance: string;
  companies?: string[];
  // companyIDs?: string[];
  workdays?: Workday[];
  // calendary: string;
}

export interface Workday {
  id?: string;
  day: number;
  companiesIDs?: string[];
}
