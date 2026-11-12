
import { useEffect, useState } from 'react';
import { stallApi } from '../api/stallApi';


import Hero from '../components/Hero';
import StallCard from '../components/StallCard';
import Pagination from '../components/Pagination';

import type { Stall } from '../api/stallApi';

interface StallListPageProps {
  stalls: Stall[];
  searchInput: string;
  category: string;
  loading: boolean;
  listError: string;
  total: number;
  pageNumber: number;
  totalPages: number;
  isAdmin: boolean;
  saving: boolean;

  canEdit: (stall: Stall) => boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  onRetry: () => void;
  onDetail: (id: number) => void;
  onEdit: (stall: Stall) => void;
  onDelete: (stall: Stall) => void;
}

export default function StallListPage({
  stalls,
  searchInput,
  category,
  loading,
  listError,
  total,
  pageNumber,
  totalPages,
  isAdmin,
  saving,
  canEdit,
  onSearchChange,
  onCategoryChange,
  onPageChange,
  onResetFilters,
  onRetry,
  onDetail,
  onEdit,
  onDelete,
}: StallListPageProps) {

  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const response = await stallApi.getCategories();

        if (active) {
          setCategories(response.data.data);
          setCategoriesError(false);
        }
      } catch {
        if (active) {
          setCategoriesError(true);
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Hero
        onExplore={() => {
          document
            .querySelector('.filters')
            ?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* SEARCH DAN FILTER */}
      <div className="filters">
        <input
          aria-label="Cari warung"
          placeholder="🔎 Cari nama warung..."
          maxLength={100}
          value={searchInput}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
        />

        
        <div className="category-filter">
        <select
            aria-label="Filter kategori"
            value={category}
            onChange={(event) =>
            onCategoryChange(event.target.value)
            }
            disabled={categoriesLoading || categoriesError}
        >
            <option value="">
            {categoriesLoading
                ? 'Memuat kategori...'
                : 'Semua kategori'}
            </option>

            {categories.map((item) => (
            <option key={item} value={item}>
                {item}
            </option>
            ))}
        </select>

        {categoriesError && (
            <span className="filter-error" role="status">
            Kategori gagal dimuat.
            </span>
        )}
        </div>

      </div>

      {/* STATUS DAFTAR WARUNG */}
      {loading ? (
        <div className="empty" role="status">
          Sedang menyiapkan daftar warung...
        </div>
      ) : listError ? (
        <div className="empty" role="alert">
          <p>{listError}</p>

          <button type="button" onClick={onRetry}>
            Coba Lagi
          </button>
        </div>
      ) : stalls.length === 0 ? (
        <div className="empty">
          <h3>Belum ada warung ditemukan</h3>
          <p>Coba ubah kata pencarian atau kategorinya.</p>

          <button
            type="button"
            onClick={onResetFilters}
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <>
          <p className="results-count">
            Menampilkan {stalls.length} dari {total} warung
          </p>

          <div className="stall-grid">
            {stalls.map((stall) => (
              <StallCard
                key={stall.id}
                stall={stall}
                canEdit={canEdit(stall)}
                isAdmin={isAdmin}
                saving={saving}
                onDetail={onDetail}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* PAGINATION */}
      {!loading && !listError && (
        <Pagination
          currentPage={pageNumber}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
