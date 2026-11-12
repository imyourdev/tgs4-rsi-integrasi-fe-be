
import type { User } from '../types/auth';

interface ProfilePageProps {
  user: User;
  onHome: () => void;
  onCreateStall: () => void;
}

export default function ProfilePage({
  user,
  onHome,
  onCreateStall,
}: ProfilePageProps) {
  const isAdmin = user.role === 'admin';
  const isOwner = user.role === 'owner';
  const canManage = isAdmin || isOwner;

  return (
    <section className="panel">
      <span className="form-eyebrow">✳ MY PROFILE</span>

      <h1>Profil Pengguna</h1>

      <div className="profile-avatar" aria-hidden="true">
        {user.name.charAt(0).toUpperCase()}
      </div>

      <p><strong>Nama:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <p>
        {isAdmin
          ? 'Kamu memiliki akses untuk mengelola seluruh warung.'
          : isOwner
            ? 'Kamu dapat menambahkan dan mengubah warung milikmu.'
            : 'Kamu dapat menjelajahi daftar dan detail warung.'}
      </p>

      <button
        type="button"
        className="btn-primary"
        onClick={onHome}
      >
        Jelajahi Warung →
      </button>

      {canManage && (
        <button
          type="button"
          onClick={onCreateStall}
        >
          + Tambah Warung
        </button>
      )}
    </section>
  );
}
