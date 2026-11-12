
import { useEffect, useState } from 'react';

import { stallApi } from '../api/stallApi';
import type { Stall } from '../api/stallApi';

interface OwnerDashboardPageProps {
  ownerId: number;
  onCreate: () => void;
  onEdit: (stall: Stall) => void;
  onBack: () => void;
}

const PAGE_LIMIT = 9;

export default function OwnerDashboardPage({
  ownerId,
  onCreate,
  onEdit,
  onBack,
}: OwnerDashboardPageProps) {
  const [myStalls, setMyStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMyStalls() {
      try {
        const allStalls: Stall[] = [];
        let page = 1;

        // Ambil semua halaman karena API
        // menggunakan pagination.
        while (!controller.signal.aborted) {
          const response = await stallApi.getAll(
            {
              page,
              limit: PAGE_LIMIT,
            },
            controller.signal
          );

          if (controller.signal.aborted) return;

          const data = response.data.data;
          const total = response.data.meta?.total;

          allStalls.push(...data);

          if (
            data.length === 0 ||
            (typeof total === 'number'
              ? allStalls.length >= total
              : data.length < PAGE_LIMIT)
          ) {
            break;
          }

          page += 1;
        }

        if (controller.signal.aborted) return;

        // Hanya tampilkan warung milik
        // akun Owner yang sedang login.
        const owned = allStalls.filter(
          (stall) =>
            String(stall.ownerId) === String(ownerId)
        );

        setMyStalls(owned);
        setError('');
      } catch {
        if (controller.signal.aborted) return;

        setError('Gagal mengambil data warung milikmu.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    // Jadwalkan fetch setelah effect berjalan.
    const timer = window.setTimeout(() => {
      void loadMyStalls();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [ownerId, retryKey]);

  function retry() {
    setLoading(true);
    setError('');
    setRetryKey((key) => key + 1);
  }

  return (
    <section className="owner-dashboard">
      <div className="owner-dashboard-header">
        <div>
          <span className="owner-eyebrow">
            ✳ OWNER WORKSPACE
          </span>

          <h1>Warung Saya</h1>

          <p>
            Kelola informasi warung milikmu
            dengan mudah di jajan.in.
          </p>
        </div>

        <button
          type="button"
          className="owner-create-button"
          onClick={onCreate}
        >
          + Tambah Warung
        </button>
      </div>

      <div className="owner-dashboard-stats">
        <div className="owner-stat-card">
          <span>Total Warung</span>
          <strong>
            {loading ? '...' : myStalls.length}
          </strong>
          <small>Warung yang kamu kelola</small>
        </div>

        <div className="owner-stat-card">
          <span>Hak Akses</span>
          <strong className="owner-stat-role">
            Owner
          </strong>
          <small>Tambah dan edit warung sendiri</small>
        </div>
      </div>

      <div className="owner-section-heading">
        <h2>Daftar Warung Milikmu ✳</h2>
        <p>
          Berikut warung yang terdaftar
          menggunakan akunmu.
        </p>
      </div>

      {loading ? (
        <div className="owner-empty-state">
          <p>⏳ Sedang memuat warungmu...</p>
        </div>
      ) : error ? (
        <div className="owner-empty-state">
          <h3>Oops, terjadi masalah!</h3>
          <p>{error}</p>

          <button
            type="button"
            onClick={retry}
          >
            Coba Lagi
          </button>
        </div>
      ) : myStalls.length === 0 ? (
        <div className="owner-empty-state">
          <div className="owner-empty-icon">🏪</div>

          <h3>Belum punya warung?</h3>

          <p>
            Kamu belum memiliki warung yang
            terdaftar. Yuk, tambahkan warung
            pertamamu!
          </p>

          <button
            type="button"
            onClick={onCreate}
          >
            + Tambah Warung Pertama
          </button>
        </div>
      ) : (
        <div className="owner-stall-grid">
          {myStalls.map((stall) => (
            <article
              className="owner-stall-card"
              key={stall.id}
            >
              <div className="owner-stall-icon">
                🏪
              </div>

              <div className="owner-stall-info">
                <span className="owner-stall-category">
                  {stall.category || 'Warung'}
                </span>

                <h3>{stall.name}</h3>

                <p>
                  📍 {stall.location ||
                    'Lokasi belum tersedia'}
                </p>

                <p className="owner-stall-description">
                  {stall.description ||
                    'Belum ada deskripsi.'}
                </p>
              </div>

              <button
                type="button"
                className="owner-edit-button"
                onClick={() => onEdit(stall)}
              >
                ✎ Edit Warung
              </button>
            </article>
          ))}
        </div>
      )}

      <button
        type="button"
        className="owner-back-button"
        onClick={onBack}
      >
        ← Kembali Jelajahi Warung
      </button>
    </section>
  );
}
