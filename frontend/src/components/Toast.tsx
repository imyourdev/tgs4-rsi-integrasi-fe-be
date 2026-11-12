
import { useEffect } from 'react';
import './Toast.css';

export type ToastType =
  | 'success'
  | 'error'
  | 'info';

export interface ToastData {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastData | null;
  onClose: () => void;
}

export default function Toast({
  toast,
  onClose,
}: ToastProps) {
  // Hilangkan notifikasi secara otomatis
  // setelah 4,5 detik.
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      onClose();
    }, 4500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast, onClose]);

  if (!toast) return null;

  const content = {
    success: {
      icon: '✓',
      title: 'Yay! Berhasil ✳',
    },
    error: {
      icon: '!',
      title: 'Oops, ada masalah!',
    },
    info: {
      icon: 'i',
      title: 'FYI, Foodie!',
    },
  }[toast.type];

  return (
    <div
      className={`toast toast-${toast.type}`}
      role={
        toast.type === 'error'
          ? 'alert'
          : 'status'
      }
      aria-live={
        toast.type === 'error'
          ? 'assertive'
          : 'polite'
      }
    >
      <span
        className="toast-icon"
        aria-hidden="true"
      >
        {content.icon}
      </span>

      <div className="toast-content">
        <strong>{content.title}</strong>
        <p>{toast.message}</p>
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Tutup notifikasi"
      >
        ×
      </button>
    </div>
  );
}
