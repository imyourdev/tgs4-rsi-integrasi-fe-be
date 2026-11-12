
export type Role = 'admin' | 'owner' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export interface LoginResult {
  token: string;
}
