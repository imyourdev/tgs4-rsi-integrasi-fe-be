
import type { User } from '../types/auth';

interface NavbarProps {
  user: User | null;
  checkingAuth: boolean;
  onHome: () => void;
  onOwnerDashboard: () => void;
  onAdminDashboard: () => void;
  onCreateStall: () => void;
  onProfile: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
}

export default function Navbar({
  user,
  checkingAuth,
  onHome,
  onOwnerDashboard,
  onAdminDashboard,
  onCreateStall,
  onProfile,
  onLogin,
  onRegister,
  onLogout,
}: NavbarProps) {
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner';

  return (
    <header className="navbar">
      {/* BRAND */}
      <button
        type="button"
        className="brand"
        onClick={onHome}
        aria-label="jajan.in — Beranda"
      >
        <img
          src="/images/logo.png"
          alt=""
          className="brand-logo"
        />

        <span className="brand-name">
          jajan<span className="brand-dot">.</span>in
        </span>
      </button>

      {/* NAVIGATION */}
      <nav
        className="nav-actions"
        aria-label="Navigasi utama"
      >
        <button
          type="button"
          onClick={onHome}
        >
          Jelajahi Warung
        </button>

        {/* OWNER ONLY */}
        {!checkingAuth && isOwner && (
          <button
            type="button"
            onClick={onOwnerDashboard}
          >
            🏪 Warung Saya
          </button>
        )}

        {/* ADMIN ONLY */}
        {!checkingAuth && isAdmin && (
          <button
            type="button"
            onClick={onAdminDashboard}
          >
            🛠 Kelola Warung
          </button>
        )}

        {!checkingAuth && isAdmin && (
          <button
            type="button"
            onClick={onCreateStall}
          >
            + Tambah Warung
          </button>
        )}

        {/* AUTH STATUS */}
        {checkingAuth ? (
          <span className="user-badge">
            Memeriksa sesi...
          </span>
        ) : user ? (
          <>
            <button
              type="button"
              className="user-badge"
              onClick={onProfile}
            >
              {user.name} · {user.role}
            </button>

            <button
              type="button"
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onLogin}
            >
              Login
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={onRegister}
            >
              Daftar
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
