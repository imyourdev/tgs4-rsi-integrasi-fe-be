import 'dotenv/config';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { getDb } from '../db/index.ts';
import { users } from '../db/schema.ts';

// Akun pengujian dari seed database lama.
const testAccounts = [
  { email: 'admin@kantin.test', role: 'admin' },
  { email: 'tini@kantin.test', role: 'owner' },
  { email: 'slamet@kantin.test', role: 'owner' },
] as const;

async function repairTestPasswords() {
  const password = process.env.TEST_ACCOUNT_PASSWORD;

  if (!password || password.length < 12) {
    throw new Error(
      'TEST_ACCOUNT_PASSWORD harus diisi minimal 12 karakter di .env'
    );
  }

  const db = await getDb();

  for (const account of testAccounts) {
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, account.email));

    const user = result[0];

    if (!user) {
      console.log(`Akun tidak ditemukan: ${account.email}`);
      continue;
    }

    // Memastikan role akun sesuai.
    if (user.role !== account.role) {
      console.log(`Role tidak sesuai: ${account.email}`);
      continue;
    }

    // Hanya memperbaiki password placeholder.
    if (!user.passwordHash.startsWith('hash_')) {
      console.log(`Password tidak diubah: ${account.email}`);
      continue;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, user.id));

    console.log(`Password berhasil diperbaiki: ${account.email}`);
  }

  console.log('Selesai memperbaiki akun pengujian.');
}

repairTestPasswords()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error('Gagal:', error);
    process.exit(1);
  });
