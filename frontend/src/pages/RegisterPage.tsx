
import type { FormEvent } from 'react';

interface RegisterPageProps {
  name: string;
  email: string;
  password: string;
  saving: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onLogin: () => void;
}

export default function RegisterPage({
  name,
  email,
  password,
  saving,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onLogin,
}: RegisterPageProps) {
  return (
    <section className="panel form-panel">
      <span className="form-eyebrow">
        ✳ JOIN THE FOOD CLUB
      </span>

      <h1>Buat Akun Baru</h1>

      <p>Yuk, gabung dan temukan pilihan warung favorit!</p>

      <form onSubmit={onSubmit}>
        <label htmlFor="register-name">Nama Lengkap</label>
        <input
          id="register-name"
          required
          minLength={3}
          maxLength={100}
          autoComplete="name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Nama lengkap"
        />

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          required
          type="email"
          maxLength={150}
          autoComplete="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="nama@email.com"
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          minLength={8}
          maxLength={72}
          required
          autoComplete="new-password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          placeholder="Minimal 8 karakter"
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
        >
          {saving ? 'Mendaftarkan...' : 'Buat Akun →'}
        </button>
      </form>

      <p>
        Sudah punya akun?{' '}
        <button type="button" onClick={onLogin}>
          Login
        </button>
      </p>
    </section>
  );
}
