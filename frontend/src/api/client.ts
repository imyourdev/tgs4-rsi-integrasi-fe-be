
import axios from 'axios';

export const TOKEN_KEY = 'kantinreview_jwt';

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000/api/v1',

  timeout: 15000,

  headers: {
    'Content-Type': 'application/json',
  },
});

// Kirim JWT otomatis untuk request yang memerlukannya.
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


/**
 * Menangani respons error dari backend.
 *
 * 401 = sesi tidak valid atau token kedaluwarsa.
 * 403 = pengguna tidak memiliki hak akses.
 */
api.interceptors.response.use(
  (response) => response,

  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const token = sessionStorage.getItem(TOKEN_KEY);

      // Login gagal tidak boleh dianggap sesi kedaluwarsa.
      const isAuthRequest =
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/register');

      if (status === 401 && token && !isAuthRequest) {
        sessionStorage.removeItem(TOKEN_KEY);

        window.dispatchEvent(
          new CustomEvent('jajan:session-expired')
        );
      }
    }

    return Promise.reject(error);
  }
);

