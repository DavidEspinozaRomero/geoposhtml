export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  username: string;
  role: 'admin' | 'employee';
  employeeId: number;
}
