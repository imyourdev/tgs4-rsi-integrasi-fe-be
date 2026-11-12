
import { useEffect, useState } from 'react';
import axios from 'axios';

import { stallApi } from '../api/stallApi';
import type { Stall } from '../api/stallApi';

interface AdminDashboardPageProps {
  onCreate: () => void;
  onEdit: (stall: Stall) => void;
  onDelete: (stall: Stall) => void;
  onBack: () => void;
}

const PAGE_LIMIT = 9;

export default function AdminDashboardPage({
  onCreate,
  onEdit,
  onDelete,
  onBack,
}: AdminDashboardPageProps) {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const [searchInput, setSearchInput] = useState('');

  // ======================================
  // GET ALL STALLS FROM BACKEND
  // ======================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadStalls() {
      try {
        const allStalls: Stall[] = [];
        let page = 1;

        // Ambil seluruh halaman dari API.
        // Data tidak dibatasi hanya 9 warung.
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

          // Berhenti setelah halaman terakhir.
          if (
            data.length === 0 ||
            data.length < PAGE_LIMIT ||
            (typeof total === 'number' &&
              allStalls.length >= total)
          ) {
            break;
          }

          page += 1;
        }

        if (controller.signal.aborted) return;

        setStalls(allStalls);
        setError('');
      } catch (err) {
        if (
          controller.signal.aborted ||
          axios.isCancel(err)
        ) {
          return;
        }

        setStalls([]);
        setError(
          'Gagal mengambil daftar warung dari backend.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    const timer = window.setTimeout(() => {
      void loadStalls();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [retryKey]);

  // ======================================
  // SEARCH — CLIENT SIDE
  // ======================================

  const keyword = searchInput.trim().toLowerCase();

  const filteredStalls = stalls.filter((stall) => {
    const searchableText = [
      stall.name,
      stall.category ?? '',
      stall.location ?? '',
      stall.description ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(keyword);
  });

  function retry() {
    setLoading(true);
    setError('');
    setRetryKey((key) => key + 1);
  }

  // ======================================
  // RENDER
  // ======================================

  return (
    <section className="admin-dashboard">
      {/* HEADER */}
      <div className="admin-dashboard-header">
        <div>
          <span className="admin-eyebrow">
            ✳ ADMIN WORKSPACE
          </span>

          <h1>Kelola Warung</h1>

          <p>
            Kelola seluruh data warung yang
            terdaftar di jajan.in.
          </p>
        </div>

        <button
          type="button"
          className="admin-create-button"
          onClick={onCreate}
        >
          + Tambah Warung
        </button>
      </div>

      {/* SUMMARY */}
      <div className="admin-dashboard-stats">
        <div className="admin-stat-card">
          <span>Total Warung</span>

          <strong>
            {loading ? '...' : error ? '—' : stalls.length}
          </strong>

          <small>
            Seluruh warung yang terdaftar
          </small>
        </div>

        <div className="admin-stat-card">
          <span>Hak Akses</span>

          <strong className="admin-stat-role">
            Admin
          </strong>

          <small>
            Tambah, edit, dan hapus warung
          </small>
        </div>
      </div>

      {/* SEARCH */}
      <div className="admin-section-heading">
        <h2>Daftar Semua Warung ✳</h2>

        <p>
          Cari dan kelola warung sesuai
          kewenangan Admin.
        </p>
      </div>

      <div className="admin-search">
        <input
          type="search"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
          placeholder="🔎 Cari nama atau kategori warung..."
          aria-label="Cari warung yang akan dikelola"
        />
      </div>

      {/* LOADING */}
      {loading ? (
        <div
          className="admin-empty-state"
          role="status"
        >
          <p>⏳ Sedang memuat data warung...</p>
        </div>
      ) : error ? (
        /* ERROR */
        <div
          className="admin-empty-state"
          role="alert"
        >
          <h3>Oops, terjadi masalah!</h3>

          <p>{error}</p>

          <button
            type="button"
            onClick={retry}
          >
            Coba Lagi
          </button>
        </div>
      ) : filteredStalls.length === 0 ? (
        /* EMPTY STATE */
        <div className="admin-empty-state">
          <div className="admin-empty-icon">
            🏪
          </div>

          <h3>
            {keyword
              ? 'Warung tidak ditemukan'
              : 'Belum ada warung'}
          </h3>

          <p>
            {keyword
              ? 'Coba gunakan kata kunci lain.'
              : 'Tambahkan warung pertama untuk memulai.'}
          </p>
        </div>
      ) : (
        /* STALL MANAGEMENT CARDS */
        <div className="admin-stall-grid">
          {filteredStalls.map((stall) => (
            <article
              key={stall.id}
              className="admin-stall-card"
            >
              <div className="admin-stall-icon">
                🏪
              </div>

              <div className="admin-stall-info">
                <span className="admin-stall-category">
                  {stall.category || 'Warung'}
                </span>

                <h3>{stall.name}</h3>

                <p>
                  📍{' '}
                  {stall.location ||
                    'Lokasi belum tersedia'}
                </p>

                <p className="admin-stall-description">
                  {stall.description ||
                    'Belum ada deskripsi warung.'}
                </p>

                <small className="admin-stall-id">
                  ID Warung: {stall.id}
                </small>
              </div>

              <div className="admin-stall-actions">
                <button
                  type="button"
                  className="admin-edit-button"
                  onClick={() => onEdit(stall)}
                >
                  ✎ Edit
                </button>

                <button
                  type="button"
                  className="admin-delete-button"
                  onClick={() => onDelete(stall)}
                >
                  🗑 Hapus
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* BACK */}
      <button
        type="button"
        className="admin-back-button"
        onClick={onBack}
      >
        ← Kembali Jelajahi Warung
      </button>
    </section>
  );
}
