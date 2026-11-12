
import { api } from './client';
import type { ApiResponse } from '../types/api';
import type {
  User,
  LoginInput,
  RegisterInput,
  LoginResult,
} from '../types/auth';

export const authApi = {
  // POST /api/v1/auth/login
  login: (credentials: LoginInput) =>
    api.post<ApiResponse<LoginResult>>(
      '/auth/login',
      credentials
    ),

  // POST /api/v1/auth/register
  register: (data: RegisterInput) =>
    api.post('/auth/register', data),

  // GET /api/v1/auth/me
  getMe: () =>
    api.get<ApiResponse<User>>('/auth/me'),
};
