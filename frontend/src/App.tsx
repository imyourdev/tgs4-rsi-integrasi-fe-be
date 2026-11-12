
import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';

import './App.css';

// API & types
import { api } from './api/client';
import type { Stall } from './api/stallApi';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useStalls } from './hooks/useStalls';
import { useStallCrud } from './hooks/useStallCrud';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import type {
  ToastData,
  ToastType,
} from './components/Toast';

// Pages
import StallListPage from './pages/StallListPage';
import StallDetailPage from './pages/StallDetailPage';
import StallFormPage from './pages/StallFormPage';
import type { StallFormValues } from './pages/StallFormPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// ==========================================
// TYPES
// ==========================================

type Page =
  | 'list'
  | 'detail'
  | 'form'
  | 'login'
  | 'register'
  | 'profile'
  | 'owner'
  | 'admin';

interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialForm: StallFormValues = {
  name: '',
  category: '',
  location: '',
  description: '',
};

// ==========================================
// ERROR HANDLER
// ==========================================

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    const body = error.response?.data as
      | {
          message?: string;
          errors?: Array<{
            field?: string;
            message?: string;
          }>;
        }
      | undefined;

    if (body?.errors?.length) {
      return body.errors
        .map(
          (item) =>
            `${item.field || 'Input'}: ${
              item.message || 'Tidak valid'
            }`
        )
        .join('; ');
    }

    if (status === 401) {
      return (
        body?.message ??
        'Sesi tidak valid. Silakan login.'
      );
    }

    if (status === 403) {
      return (
        body?.message ??
        'Kamu tidak memiliki izin.'
      );
    }

    if (status === 404) {
      return (
        body?.message ??
        'Data tidak ditemukan.'
      );
    }

    if (status === 409) {
      return (
        body?.message ??
        'Data sudah terdaftar.'
      );
    }

    if (body?.message) {
      return body.message;
    }

    if (!error.response) {
      return (
        'Tidak dapat menghubungi backend. ' +
        'Pastikan server Express berjalan.'
      );
    }

    return `Request gagal (HTTP ${status}).`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi kesalahan yang tidak diketahui.';
}

// ==========================================
// MAIN APPLICATION
// ==========================================

export default function App() {
  // ----------------------------------------
  // NAVIGATION
  // ----------------------------------------

  const [page, setPage] = useState<Page>('list');

  // ----------------------------------------
  // AUTHENTICATION
  // ----------------------------------------

  const {
    user,
    checkingAuth,
    login,
    register,
    logout: logoutAuth,
  } = useAuth();

  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authSaving, setAuthSaving] = useState(false);

  // ----------------------------------------
  // TOAST NOTIFICATIONS
  // ----------------------------------------

  const [toast, setToast] = useState<ToastData | null>(
    null
  );

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  function notify(
    type: ToastType,
    message: string
  ) {
    setToast({
      id: Date.now(),
      type,
      message,
    });
  }

  // ----------------------------------------
  // STALL LIST
  // ----------------------------------------

  const [selectedStall, setSelectedStall] =
    useState<Stall | null>(null);

  const [reloadKey, setReloadKey] = useState(0);

  const {
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
  } = useStalls(page === 'list', reloadKey);

  // ----------------------------------------
  // STALL FORM
  // ----------------------------------------

  const [stallForm, setStallForm] =
    useState<StallFormValues>(initialForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  // Simpan objek warung yang sedang diedit.
  // Ini mencegah validasi Owner bergantung
  // pada selectedStall dari halaman detail.
  const [editingStall, setEditingStall] =
    useState<Stall | null>(null);

  const {
    saving,
    saveStall: saveStallApi,
    removeStall,
  } = useStallCrud();

  const [detailLoading, setDetailLoading] =
    useState(false);

  // ----------------------------------------
  // ROLE & PERMISSIONS
  // ----------------------------------------

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner';
  const canManage = isAdmin || isOwner;

  function canEdit(stall: Stall): boolean {
    return Boolean(
      isAdmin ||
        (isOwner && user?.id === stall.ownerId)
    );
  }

  // ----------------------------------------
  // NAVIGATION HELPER
  // ----------------------------------------

  function navigate(target: Page) {
    setPage(target);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  // ==========================================
  // JWT SESSION EXPIRED
  // ==========================================

  // Hanya satu listener agar event
  // kedaluwarsa tidak ditangani dua kali.
  useEffect(() => {
    function handleSessionExpired() {
      setSelectedStall(null);
      setEditingStall(null);
      setEditingId(null);
      setPage('login');

      setToast({
        id: Date.now(),
        type: 'error',
        message:
          'Sesi kamu sudah berakhir. ' +
          'Silakan login kembali.',
      });

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    window.addEventListener(
      'jajan:session-expired',
      handleSessionExpired
    );

    return () => {
      window.removeEventListener(
        'jajan:session-expired',
        handleSessionExpired
      );
    };
  }, []);

  // ==========================================
  // GET STALL DETAIL
  // ==========================================

  async function openDetail(id: number) {
    if (detailLoading) return;

    setDetailLoading(true);

    try {
      const response =
        await api.get<ApiResponse<Stall>>(
          `/stalls/${id}`
        );

      setSelectedStall(response.data.data);
      navigate('detail');
    } catch (error) {
      notify('error', getErrorMessage(error));
    } finally {
      setDetailLoading(false);
    }
  }

  // ==========================================
  // LOGIN
  // ==========================================

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (authSaving) return;

    setAuthSaving(true);

    try {
      const loggedInUser = await login({
        email: authEmail.trim(),
        password: authPassword,
      });

      setAuthPassword('');
      navigate('list');

      notify(
        'success',
        `Selamat datang, ${loggedInUser.name}!`
      );
    } catch (error) {
      notify(
        'error',
        getErrorMessage(error)
      );
    } finally {
      setAuthSaving(false);
    }
  }

  // ==========================================
  // REGISTER
  // ==========================================

  async function handleRegister(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (authSaving) return;

    setAuthSaving(true);

    try {
      await register({
        name: authName.trim(),
        email: authEmail.trim(),
        password: authPassword,
      });

      setAuthPassword('');
      navigate('login');

      notify(
        'success',
        'Registrasi berhasil! Silakan login.'
      );
    } catch (error) {
      notify(
        'error',
        getErrorMessage(error)
      );
    } finally {
      setAuthSaving(false);
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  function logout() {
    logoutAuth();

    setAuthEmail('');
    setAuthPassword('');

    setSelectedStall(null);
    setEditingStall(null);
    setEditingId(null);

    navigate('list');

    notify(
      'success',
      'Kamu telah logout.'
    );
  }

  // ==========================================
  // OPEN CREATE FORM
  // ==========================================

  function openCreateForm() {
    if (!canManage) {
      notify(
        'error',
        'Kamu tidak memiliki izin menambah warung.'
      );
      return;
    }

    setEditingId(null);
    setEditingStall(null);
    setStallForm({ ...initialForm });

    navigate('form');
  }

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  function openEditForm(stall: Stall) {
    if (!canEdit(stall)) {
      notify(
        'error',
        'Kamu tidak memiliki izin mengedit warung ini.'
      );
      return;
    }

    setEditingId(stall.id);
    setEditingStall(stall);

    setStallForm({
      name: stall.name,
      category: stall.category ?? '',
      location: stall.location ?? '',
      description: stall.description ?? '',
    });

    navigate('form');
  }

  // ==========================================
  // CREATE / UPDATE STALL
  // ==========================================

  async function saveStall(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    if (!canManage) {
      notify(
        'error',
        'Kamu tidak memiliki izin mengelola warung.'
      );
      return;
    }

    const payload = {
      name: stallForm.name.trim(),
      category: stallForm.category.trim(),
      location: stallForm.location.trim(),
      description: stallForm.description.trim(),
    };

    // Validasi dasar sebelum request API.
    if (payload.name.length < 3) {
      notify(
        'error',
        'Nama warung minimal 3 karakter.'
      );
      return;
    }

    // Pemeriksaan frontend.
    // Backend tetap wajib memverifikasi ownership.
    if (
      editingId !== null &&
      !isAdmin &&
      !(
        isOwner &&
        editingStall?.id === editingId &&
        editingStall.ownerId === user?.id
      )
    ) {
      notify(
        'error',
        'Kamu tidak memiliki izin mengedit warung ini.'
      );
      return;
    }

    try {
      await saveStallApi(
        payload,
        editingId
      );

      const successMessage =
        editingId === null
          ? 'Warung berhasil ditambahkan!'
          : 'Data warung berhasil diperbarui!';

      setEditingId(null);
      setEditingStall(null);
      setSelectedStall(null);

      setPageNumber(1);
      setReloadKey((key) => key + 1);

      navigate('list');

      notify(
        'success',
        successMessage
      );
    } catch (error) {
      notify(
        'error',
        getErrorMessage(error)
      );
    }
  }

  // ==========================================
  // DELETE STALL
  // ==========================================

  async function deleteStall(stall: Stall) {
    if (!isAdmin || saving) return;

    const confirmed = window.confirm(
      `Yakin ingin menghapus warung "${stall.name}"?\n` +
        'Tindakan ini tidak dapat dibatalkan.'
    );

    if (!confirmed) return;

    try {
      await removeStall(stall.id);

      setSelectedStall(null);
      setEditingStall(null);
      setEditingId(null);

      setPageNumber(1);
      setReloadKey((key) => key + 1);

      navigate('list');

      notify(
        'success',
        'Warung berhasil dihapus!'
      );
    } catch (error) {
      notify(
        'error',
        getErrorMessage(error)
      );
    }
  }

  // ==========================================
  // UPDATE FORM FIELD
  // ==========================================

  function updateForm(
    field: keyof StallFormValues,
    value: string
  ) {
    setStallForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="app">
      {/* NOTIFICATION */}
      <Toast
        toast={toast}
        onClose={closeToast}
      />

      {/* NAVBAR */}
      <Navbar
        user={user}
        checkingAuth={checkingAuth}
        onHome={() => navigate('list')}
        onOwnerDashboard={() => {
          if (user?.role === 'owner') {
            navigate('owner');
          }
        }}

        onAdminDashboard={() => {
          if (user?.role === 'admin') {
            navigate('admin');
          }
        }}

        onCreateStall={openCreateForm}
        onProfile={() => navigate('profile')}
        onLogin={() => navigate('login')}
        onRegister={() => navigate('register')}
        onLogout={logout}
      />

      <main className="container">
        {/* ==================================
    OWNER DASHBOARD
================================== */}

        {page === 'owner' &&
          user?.role === 'owner' && (
            <OwnerDashboardPage
              ownerId={user.id}
              onCreate={openCreateForm}
              onEdit={openEditForm}
              onBack={() => navigate('list')}
            />
          )}

        
        {/* ==================================
            ADMIN DASHBOARD
        ================================== */}

        {page === 'admin' &&
          user?.role === 'admin' && (
            <AdminDashboardPage
              onCreate={openCreateForm}
              onEdit={openEditForm}
              onDelete={(stall) => {
                void deleteStall(stall);
              }}
              onBack={() => navigate('list')}
            />
          )}



        {/* STALL LIST */}
        {page === 'list' && (
          <StallListPage
            stalls={stalls}
            searchInput={searchInput}
            category={category}
            loading={loading}
            listError={listError}
            total={total}
            pageNumber={pageNumber}
            totalPages={totalPages}
            isAdmin={isAdmin}
            saving={saving || detailLoading}
            canEdit={canEdit}
            onSearchChange={(value) => {
              setSearchInput(value);
              setPageNumber(1);
            }}
            onCategoryChange={(value) => {
              setCategory(value);
              setPageNumber(1);
            }}
            onPageChange={setPageNumber}
            onResetFilters={resetFilters}
            onRetry={() => {
              setReloadKey((key) => key + 1);
            }}
            onDetail={(id) => {
              void openDetail(id);
            }}
            onEdit={openEditForm}
            onDelete={(stall) => {
              void deleteStall(stall);
            }}
          />
        )}

        {/* STALL DETAIL */}
        {page === 'detail' && selectedStall && (
          <StallDetailPage
            stall={selectedStall}
            canEdit={canEdit(selectedStall)}
            isAdmin={isAdmin}
            saving={saving}
            onBack={() => navigate('list')}
            onEdit={openEditForm}
            onDelete={(stall) => {
              void deleteStall(stall);
            }}
          />
        )}

        {/* CREATE / EDIT FORM */}
        {page === 'form' && canManage && (
          <StallFormPage
            form={stallForm}
            editingId={editingId}
            saving={saving}
            onFieldChange={updateForm}
            onSubmit={(event) => {
              void saveStall(event);
            }}
            onCancel={() => navigate('list')}
          />
        )}

        {/* LOGIN PAGE */}
        {page === 'login' && !user && (
          <LoginPage
            email={authEmail}
            password={authPassword}
            saving={authSaving}
            onEmailChange={setAuthEmail}
            onPasswordChange={setAuthPassword}
            onSubmit={(event) => {
              void handleLogin(event);
            }}
            onRegister={() => navigate('register')}
          />
        )}

        {/* REGISTER PAGE */}
        {page === 'register' && !user && (
          <RegisterPage
            name={authName}
            email={authEmail}
            password={authPassword}
            saving={authSaving}
            onNameChange={setAuthName}
            onEmailChange={setAuthEmail}
            onPasswordChange={setAuthPassword}
            onSubmit={(event) => {
              void handleRegister(event);
            }}
            onLogin={() => navigate('login')}
          />
        )}

        {/* PROFILE PAGE */}
        {page === 'profile' && user && (
          <ProfilePage
            user={user}
            onHome={() => navigate('list')}
            onCreateStall={openCreateForm}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
