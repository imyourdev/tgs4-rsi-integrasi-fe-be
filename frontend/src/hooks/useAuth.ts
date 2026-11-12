
import { useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { TOKEN_KEY } from '../api/client';

import type {
  User,
  LoginInput,
  RegisterInput,
} from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);


  // Mendengarkan pemberitahuan ketika sesi JWT berakhir.
  useEffect(() => {
    function handleSessionExpired() {
      setUser(null);
      setCheckingAuth(false);
    }

    window.addEventListener(
      'jajan:session-expired',
      handleSessionExpired
    );

    return () => {
      window.removeEventListener(
        'jajan:session-expired',
        handleSessionExpired
      );
    };
  }, []);


  // Periksa JWT ketika aplikasi pertama kali dibuka.
  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const token = sessionStorage.getItem(TOKEN_KEY);

      if (!token) {
        if (active) setCheckingAuth(false);
        return;
      }

      try {
        const response = await authApi.getMe();

        if (active) {
          setUser(response.data.data);
        }
      } catch {
        // Jika JWT tidak valid, hapus sesi lokal.
        sessionStorage.removeItem(TOKEN_KEY);

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setCheckingAuth(false);
        }
      }
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, []);

  // Login dan ambil informasi pengguna.
  async function login(credentials: LoginInput): Promise<User> {
    try {
      const response = await authApi.login(credentials);
      const token = response.data.data.token;

      if (!token) {
        throw new Error('Token login tidak ditemukan.');
      }

      sessionStorage.setItem(TOKEN_KEY, token);

      const profileResponse = await authApi.getMe();
      const loggedInUser = profileResponse.data.data;

      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      sessionStorage.removeItem(TOKEN_KEY);
      setUser(null);
      throw error;
    }
  }

  // Registrasi akun baru.
  async function register(data: RegisterInput): Promise<void> {
    await authApi.register(data);
  }

  // Mengakhiri sesi lokal.
  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return {
    user,
    checkingAuth,
    login,
    register,
    logout,
  };
}
