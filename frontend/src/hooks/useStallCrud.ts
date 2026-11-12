
import { useRef, useState } from 'react';
import { stallApi } from '../api/stallApi';
import type { StallInput } from '../api/stallApi';

export function useStallCrud() {
  const [saving, setSaving] = useState(false);
  const processing = useRef(false);

  // Mencegah request CRUD ganda.
  async function runMutation(
    action: () => Promise<unknown>
  ): Promise<void> {
    if (processing.current) {
      throw new Error('Proses sebelumnya belum selesai.');
    }

    processing.current = true;
    setSaving(true);

    try {
      await action();
    } finally {
      processing.current = false;
      setSaving(false);
    }
  }

  // POST /stalls atau PUT /stalls/:id
  async function saveStall(
    payload: StallInput,
    editingId: number | null
  ): Promise<void> {
    await runMutation(async () => {
      if (editingId === null) {
        await stallApi.create(payload);
      } else {
        await stallApi.update(editingId, payload);
      }
    });
  }

  // DELETE /stalls/:id
  async function removeStall(id: number): Promise<void> {
    await runMutation(async () => {
      await stallApi.remove(id);
    });
  }

  return {
    saving,
    saveStall,
    removeStall,
  };
}
