
import { api } from './client';
import type { ApiResponse } from '../types/api';

export interface Stall {
  id: number;
  ownerId: number;
  name: string;
  category: string | null;
  location: string | null;
  description: string | null;
  avgRating: number;
  reviewCount: number;
  isPopular: boolean;
}

export interface StallInput {
  name: string;
  category?: string;
  location?: string;
  description?: string;
}

export interface StallQuery {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const stallApi = {

    getCategories: () =>
        api.get<ApiResponse<string[]>>('/stalls/categories'),

    getAll: (params: StallQuery, signal?: AbortSignal) =>
    api.get<ApiResponse<Stall[]>>('/stalls', {
      params,
      signal,
    }),

    getById: (id: number) =>
    api.get<ApiResponse<Stall>>(`/stalls/${id}`),

    create: (data: StallInput) =>
    api.post<ApiResponse<Stall>>('/stalls', data),

    update: (id: number, data: Partial<StallInput>) =>
    api.put<ApiResponse<Stall>>(`/stalls/${id}`, data),

    remove: (id: number) =>
    api.delete<ApiResponse<Stall>>(`/stalls/${id}`),
};
