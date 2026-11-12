
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import { stallApi } from '../api/stallApi';
import type { Stall } from '../api/stallApi';

const PAGE_LIMIT = 9;

export function useStalls(
  enabled: boolean,
  reloadKey: number
) {
  // ======================================
  // STATE
  // ======================================

  const [stalls, setStalls] =
    useState<Stall[]>([]);

  const [searchInput, setSearchInput] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [category, setCategory] =
    useState('');

  const [pageNumber, setPageNumber] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [listError, setListError] =
    useState('');

  // ======================================
  // PAGINATION
  // ======================================

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_LIMIT)
  );

  // ======================================
  // SEARCH DEBOUNCE
  // ======================================

  // Tunggu 350 ms setelah pengguna
  // berhenti mengetik sebelum mencari.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  // ======================================
  // FETCH DATA
  // ======================================

  const fetchStalls = useCallback(
    async (signal: AbortSignal) => {
      // Jangan melakukan request bila
      // operasi sudah dibatalkan.
      if (signal.aborted) return;

      setLoading(true);
      setListError('');

      try {
        const response = await stallApi.getAll(
          {
            search: search || undefined,
            category: category || undefined,
            page: pageNumber,
            limit: PAGE_LIMIT,
          },
          signal
        );

        if (signal.aborted) return;

        setStalls(response.data.data);

        setTotal(
          response.data.meta?.total ?? 0
        );
      } catch (error) {
        // Request yang dibatalkan tidak
        // dianggap sebagai error.
        if (
          axios.isCancel(error) ||
          signal.aborted
        ) {
          return;
        }

        setStalls([]);
        setTotal(0);

        const message =
          axios.isAxiosError(error)
            ? error.response?.data?.message ??
              'Gagal mengambil daftar warung.'
            : 'Terjadi kesalahan saat memuat data.';

        setListError(message);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [
      search,
      category,
      pageNumber,
    ]
  );

  // ======================================
  // FETCH WHEN ACTIVE
  // ======================================

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();

    // Jadwalkan pemanggilan fetch di luar
    // eksekusi sinkron useEffect.
    //
    // Ini menghindari state update
    // sinkron dari effect dan tetap
    // mempertahankan AbortController.
    const timer = window.setTimeout(() => {
      if (!controller.signal.aborted) {
        void fetchStalls(controller.signal);
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [
    enabled,
    fetchStalls,
    reloadKey,
  ]);

  // ======================================
  // RESET FILTERS
  // ======================================

  function resetFilters() {
    setSearchInput('');
    setSearch('');
    setCategory('');
    setPageNumber(1);
  }

  // ======================================
  // RETURN
  // ======================================

  return {
    stalls,
    searchInput,
    setSearchInput,
    category,
    setCategory,
    pageNumber,
    setPageNumber,
    total,
    totalPages,
    loading,
    listError,
    resetFilters,
  };
}
