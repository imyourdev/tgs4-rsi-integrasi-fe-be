
import type { Stall } from '../api/stallApi';

interface StallCardProps {
  stall: Stall;
  canEdit: boolean;
  isAdmin: boolean;
  saving: boolean;
  onDetail: (id: number) => void;
  onEdit: (stall: Stall) => void;
  onDelete: (stall: Stall) => void;
}

interface FoodVisual {
  image?: string;
  emoji: string;
  label: string;
}

// Cocokkan ilustrasi dengan kategori dan deskripsi,
// bukan dengan ID warung.
function getFoodVisual(stall: Stall): FoodVisual {
  const text = [
    stall.name,
    stall.category ?? '',
    stall.description ?? '',
  ]
    .join(' ')
    .toLowerCase();

  if (/kwetiau|kwetiaw/.test(text)) {
    return {
      image: '/images/kwetiaw.png',
      emoji: '🍜',
      label: 'Kwetiau',
    };
  }

  if (/nasi goreng/.test(text)) {
    return {
      image: '/images/nasigoreng.png',
      emoji: '🍚',
      label: 'Nasi Goreng',
    };
  }

  if (/mie ayam|pangsit/.test(text)) {
    return {
      image: '/images/mieayam.png',
      emoji: '🍜',
      label: 'Mie Ayam',
    };
  }

  if (/katsu|chicken steak|western/.test(text)) {
    return {
      image: '/images/ayam-katsu.png',
      emoji: '🍗',
      label: 'Chicken Katsu',
    };
  }

  if (/es teh|teh manis/.test(text)) {
    return {
      image: '/images/esteh.png',
      emoji: '🧋',
      label: 'Es Teh',
    };
  }

  if (/kopi|coffee/.test(text)) {
    return {
      image: '/images/es-kopi.png',
      emoji: '☕',
      label: 'Kopi',
    };
  }

  if (/es jeruk|jeruk peras/.test(text)) {
    return {
      image: '/images/es-jeruk.png',
      emoji: '🍊',
      label: 'Es Jeruk',
    };
  }

  if (/roti bakar/.test(text)) {
    return {
      image: '/images/rotibakar.png',
      emoji: '🍞',
      label: 'Roti Bakar',
    };
  }

  if (/roti aoka/.test(text)) {
    return {
      image: '/images/roti-aoka.png',
      emoji: '🍞',
      label: 'Roti',
    };
  }

  // Menu tanpa aset foto yang sesuai.
  if (/bakso/.test(text)) {
    return { emoji: '🍲', label: 'Bakso' };
  }

  if (/sate/.test(text)) {
    return { emoji: '🍢', label: 'Sate' };
  }

  if (/soto/.test(text)) {
    return { emoji: '🍲', label: 'Soto' };
  }

  if (/jus|juice|buah/.test(text)) {
    return { emoji: '🥤', label: 'Jus Buah' };
  }

  if (/nasi uduk/.test(text)) {
    return { emoji: '🍚', label: 'Nasi Uduk' };
  }

  // Fallback untuk warung baru yang belum dikenali.
  return {
    emoji: '🍽️',
    label: 'Menu Warung',
  };
}

export default function StallCard({
  stall,
  canEdit,
  isAdmin,
  saving,
  onDetail,
  onEdit,
  onDelete,
}: StallCardProps) {
  const visual = getFoodVisual(stall);

  return (
    <article className="stall-card">
      <div className="card-image">
        {visual.image ? (
          <img
            src={visual.image}
            alt={`Ilustrasi ${visual.label}`}
            loading="lazy"
            className="food-image"
          />
        ) : (
          <div
            className="food-placeholder"
            role="img"
            aria-label={`Ilustrasi ${visual.label}`}
          >
            <span className="food-placeholder-emoji">
              {visual.emoji}
            </span>

            <span className="food-placeholder-label">
              {visual.label}
            </span>
          </div>
        )}

        <span className="image-caption">
          {visual.image
            ? 'Ilustrasi menu'
            : 'Foto belum tersedia'}
        </span>
      </div>

      <div className="card-body">
        <span className="category">
          {stall.category || 'Kantin Kampus'}
        </span>

        <h2>{stall.name}</h2>

        <p>
          📍 {stall.location || 'Lokasi belum tersedia'}
        </p>

        <p className="description">
          {stall.description ||
            'Belum ada deskripsi warung.'}
        </p>

        <p className="rating">
          ★ {Number(stall.avgRating ?? 0).toFixed(1)}
          {' · '}
          {stall.reviewCount ?? 0} ulasan
        </p>

        {stall.isPopular && (
          <span className="popular-label">
            ✳ Pilihan Populer
          </span>
        )}

        <div className="card-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => onDetail(stall.id)}
          >
            Lihat Detail ↗
          </button>

          {canEdit && (
            <button
              type="button"
              onClick={() => onEdit(stall)}
            >
              Edit
            </button>
          )}

          {isAdmin && (
            <button
              type="button"
              className="btn-danger"
              disabled={saving}
              onClick={() => onDelete(stall)}
            >
              Hapus
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
