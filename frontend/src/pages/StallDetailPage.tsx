
import type { Stall } from '../api/stallApi';

interface StallDetailPageProps {
  stall: Stall;
  canEdit: boolean;
  isAdmin: boolean;
  saving: boolean;
  onBack: () => void;
  onEdit: (stall: Stall) => void;
  onDelete: (stall: Stall) => void;
}

export default function StallDetailPage({
  stall,
  canEdit,
  isAdmin,
  saving,
  onBack,
  onEdit,
  onDelete,
}: StallDetailPageProps) {
  return (
    <section className="panel">
      <button type="button" onClick={onBack}>
        ← Kembali
      </button>

      <div
        className="detail-illustration"
        aria-hidden="true"
      >
        🍽️
      </div>

      <span className="category">
        {stall.category || 'Kantin Kampus'}
      </span>

      <h1>{stall.name}</h1>

      <p>
        <strong>Lokasi:</strong>{' '}
        {stall.location || 'Belum tersedia'}
      </p>

      <p>
        <strong>Deskripsi:</strong>{' '}
        {stall.description || 'Belum ada deskripsi.'}
      </p>

      <p>
        <strong>Rating:</strong>{' '}
        ★ {Number(stall.avgRating ?? 0).toFixed(1)}
      </p>

      <p>
        <strong>Jumlah Ulasan:</strong>{' '}
        {stall.reviewCount ?? 0}
      </p>

      {canEdit && (
        <button
          type="button"
          className="btn-primary"
          onClick={() => onEdit(stall)}
        >
          Edit Warung
        </button>
      )}

      {isAdmin && (
        <button
          type="button"
          className="btn-danger"
          disabled={saving}
          onClick={() => onDelete(stall)}
        >
          Hapus Warung
        </button>
      )}
    </section>
  );
}
