
import type { FormEvent } from 'react';

interface LoginPageProps {
  email: string;
  password: string;
  saving: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRegister: () => void;
}

export default function LoginPage({
  email,
  password,
  saving,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onRegister,
}: LoginPageProps) {
  return (
    <section className="panel form-panel">
      <span className="form-eyebrow">
        ✳ WELCOME BACK
      </span>

      <h1>Halo, Foodie!</h1>

      <p>Masuk untuk menjelajahi jajan.in.</p>

      <form onSubmit={onSubmit}>
        <label htmlFor="login-email">
          Email
        </label>

        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) =>
            onEmailChange(event.target.value)
          }
          placeholder="nama@email.com"
        />

        <label htmlFor="login-password">
          Password
        </label>

        <input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) =>
            onPasswordChange(event.target.value)
          }
          placeholder="Masukkan password"
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
        >
          {saving ? 'Memproses...' : 'Login →'}
        </button>
      </form>

      <p>
        Belum punya akun?{' '}
        <button
          type="button"
          onClick={onRegister}
        >
          Registrasi
        </button>
      </p>
    </section>
  );
}
