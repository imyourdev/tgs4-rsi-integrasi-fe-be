
export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}
