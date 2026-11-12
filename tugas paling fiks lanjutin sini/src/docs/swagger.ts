
import swaggerAutogen from 'swagger-autogen';
import { readFile, writeFile } from 'node:fs/promises';

// Konfigurasi Swagger
const doc = {
  info: {
    title: 'Review Kantin API',
    version: '1.0.0',
    description:
      'REST API Review Kantin dengan JWT Authentication',
  },

  host: 'localhost:3000',
  schemes: ['http'],

  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description:
        'Masukkan Bearer diikuti spasi dan token JWT',
    },
  },

  definitions: {
    StallInput: {
      $name: 'Warung Baru',
      category: 'Nasi',
      location: 'Kantin FK',
      description: '',
    },

    UserInput: {
      $name: 'Nama Pengguna',
      $email: 'user@example.test',
      $passwordHash: 'hash-password',
      $role: 'customer',
    },

    RegisterInput: {
      $name: 'Budi Santoso',
      $email: 'budi@example.com',
      $password: 'Password123!',
    },

    LoginInput: {
      $email: 'budi@example.com',
      $password: 'Password123!',
    },

    MenuItemInput: {
      $stallId: 1,
      $name: 'Menu Baru',
      $price: 15000,
      isAvailable: true,
    },

    ReviewInput: {
      $stallId: 1,
      $userId: 12,
      $rating: 5,
      comment: 'Enak',
    },

    StallReviewInput: {
      $rating: 5,
      comment: 'Makanannya enak',
    },

    LikeInput: {
      $reviewId: 1,
    },

    FlagStatusInput: {
      $status: 'resolved',
    },

    AuditLogInput: {
      $userId: 1,
      $action: 'UPDATE',
      $targetTable: 'FLAGS',
      $targetId: 1,
      metadata: '{"status":"resolved"}',
    },
  },
};

// Lokasi file output sesuai proyek asli
const outputFile = './src/docs/swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

async function generateSwagger() {
  // Generate dokumentasi Swagger
  await swaggerAutogen()(
    outputFile,
    endpointsFiles,
    doc
  );

  // Baca hasil generate
  const content = await readFile(outputFile, 'utf8');
  const swagger = JSON.parse(content);

  // Perbaikan khusus endpoint /auth/me
  const authMe = swagger.paths?.['/api/v1/auth/me']?.get;

  if (authMe) {
    // Hapus parameter Authorization manual
    authMe.parameters = (authMe.parameters ?? []).filter(
      (parameter: { name?: string; in?: string }) =>
        !(
          parameter.name?.toLowerCase() === 'authorization' &&
          parameter.in?.toLowerCase() === 'header'
        )
    );

    // Gunakan tombol Authorize untuk JWT
    authMe.security = [{ bearerAuth: [] }];
  }

  // Simpan hasil yang sudah diperbaiki
  await writeFile(
    outputFile,
    JSON.stringify(swagger, null, 2),
    'utf8'
  );

  console.log('Swagger berhasil dibuat.');
}

generateSwagger().catch((error: unknown) => {
  console.error('Gagal generate Swagger:', error);
  process.exitCode = 1;
});
