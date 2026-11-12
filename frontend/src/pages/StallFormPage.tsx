
import { useState } from 'react';
import type { FormEvent } from 'react';

export interface StallFormValues {
  name: string;
  category: string;
  location: string;
  description: string;
}

type FieldName = keyof StallFormValues;
type FieldErrors = Partial<Record<FieldName, string>>;

interface StallFormPageProps {
  form: StallFormValues;
  editingId: number | null;
  saving: boolean;
  onFieldChange: (
    field: FieldName,
    value: string
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

// Validasi tambahan di frontend.
// Backend tetap menjadi sumber validasi utama.
function validateForm(form: StallFormValues): FieldErrors {
  const errors: FieldErrors = {};
  const name = form.name.trim();

  if (!name) {
    errors.name = 'Nama warung wajib diisi.';
  } else if (name.length < 3) {
    errors.name = 'Nama warung minimal 3 karakter.';
  } else if (name.length > 100) {
    errors.name = 'Nama warung maksimal 100 karakter.';
  }

  if (form.category.trim().length > 50) {
    errors.category = 'Kategori maksimal 50 karakter.';
  }

  if (form.location.trim().length > 100) {
    errors.location = 'Lokasi maksimal 100 karakter.';
  }

  if (form.description.trim().length > 1000) {
    errors.description = 'Deskripsi maksimal 1000 karakter.';
  }

  return errors;
}

export default function StallFormPage({
  form,
  editingId,
  saving,
  onFieldChange,
  onSubmit,
  onCancel,
}: StallFormPageProps) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const isEditing = editingId !== null;

  function updateField(field: FieldName, value: string) {
    onFieldChange(field, value);

    // Hapus error kolom ketika pengguna memperbaiki input.
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Lanjutkan ke fungsi saveStall() di App.tsx.
    onSubmit(event);
  }

  return (
    <section className="panel form-panel">
      <span className="form-eyebrow">
        ✳ STALL MANAGEMENT
      </span>

      <h1>
        {isEditing ? 'Edit Warung' : 'Tambah Warung'}
      </h1>

      <p>
        {isEditing
          ? 'Perbarui informasi warung pilihanmu.'
          : 'Daftarkan warung baru ke jajan.in.'}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="stall-name">
          Nama Warung *
        </label>

        <input
          id="stall-name"
          required
          minLength={3}
          maxLength={100}
          value={form.name}
          placeholder="Contoh: Warung Bu Tini"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={
            errors.name ? 'stall-name-error' : undefined
          }
          onChange={(event) =>
            updateField('name', event.target.value)
          }
        />

        {errors.name && (
          <p
            id="stall-name-error"
            className="field-error"
            role="alert"
          >
            {errors.name}
          </p>
        )}

        <label htmlFor="stall-category">
          Kategori
        </label>

        <input
          id="stall-category"
          maxLength={50}
          value={form.category}
          placeholder="Contoh: Makanan"
          aria-invalid={Boolean(errors.category)}
          onChange={(event) =>
            updateField('category', event.target.value)
          }
        />

        {errors.category && (
          <p className="field-error" role="alert">
            {errors.category}
          </p>
        )}

        <label htmlFor="stall-location">
          Lokasi
        </label>

        <input
          id="stall-location"
          maxLength={100}
          value={form.location}
          placeholder="Contoh: Kantin Gedung A"
          aria-invalid={Boolean(errors.location)}
          onChange={(event) =>
            updateField('location', event.target.value)
          }
        />

        {errors.location && (
          <p className="field-error" role="alert">
            {errors.location}
          </p>
        )}

        <label htmlFor="stall-description">
          Deskripsi
        </label>

        <textarea
          id="stall-description"
          rows={5}
          maxLength={1000}
          value={form.description}
          placeholder="Ceritakan sedikit tentang warung ini..."
          aria-invalid={Boolean(errors.description)}
          onChange={(event) =>
            updateField('description', event.target.value)
          }
        />

        {errors.description && (
          <p className="field-error" role="alert">
            {errors.description}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
        >
          {saving ? 'Menyimpan...' : 'Simpan Warung ↗'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Batal
        </button>
      </form>
    </section>
  );
}
