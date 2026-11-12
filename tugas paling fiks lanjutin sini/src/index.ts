import 'dotenv/config';

import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from 'express';

import cors from 'cors';
import { sql } from 'drizzle-orm';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from './docs/swagger-output.json' with { type: 'json' };

import { getDb } from './db/index.ts';
import { stallRouter } from './routes/stallRouter.ts';
import { assignmentRouter } from './routes/assignmentRouter.ts';
import { authRouter } from './routes/authRouter.ts';

// ==========================================
// KONFIGURASI SERVER
// ==========================================

const app: Application = express();
const PORT = Number(process.env.PORT ?? 3000);

const FRONTEND_URL =
  process.env.FRONTEND_URL ?? 'http://localhost:5173';

// ==========================================
// MIDDLEWARE CORS
// ==========================================

// Mengizinkan frontend React mengakses backend.
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

// Middleware untuk membaca JSON.
app.use(express.json({ limit: '1mb' }));

// ==========================================
// SWAGGER DOCUMENTATION
// ==========================================

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/health', async (_req: Request, res: Response) => {
  try {
    const db = await getDb();

    await db.execute(sql`SELECT 1 AS ok`);

    res.status(200).json({
      status: 'success',
      message: 'Server dan database terhubung',
    });
  } catch (error) {
    console.error('Health check error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Gagal terhubung ke database',
    });
  }
});

// ==========================================
// ROUTES API
// ==========================================

// Autentikasi: register, login, dan profil.
app.use('/api/v1/auth', authRouter);

// CRUD warung.
app.use('/api/v1/stalls', stallRouter);

// Route tambahan dari tugas sebelumnya.
app.use('/api/v1', assignmentRouter);

// ==========================================
// 404 - ENDPOINT TIDAK DITEMUKAN
// ==========================================

app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: `Endpoint ${req.method} ${req.path} tidak ditemukan`,
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
  (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (res.headersSent) {
      next(error);
      return;
    }

    // Error karena JSON tidak valid.
    if (
      error instanceof SyntaxError &&
      'status' in error &&
      error.status === 400
    ) {
      res.status(400).json({
        status: 'fail',
        message: 'Body JSON tidak valid',
      });
      return;
    }

    // Error karena ukuran request terlalu besar.
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      error.status === 413
    ) {
      res.status(413).json({
        status: 'fail',
        message: 'Ukuran body melebihi batas',
      });
      return;
    }

    console.error('Unhandled API error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
  }
);

// ==========================================
// MENJALANKAN SERVER
// ==========================================

app.listen(PORT, () => {
  console.log('===================================');
  console.log('SISTEM REVIEW KANTIN - BACKEND');
  console.log('===================================');
  console.log(`Server : http://localhost:${PORT}`);
  console.log(`Health : http://localhost:${PORT}/health`);
  console.log(`API    : http://localhost:${PORT}/api/v1`);
  console.log(`Docs   : http://localhost:${PORT}/docs`);
  console.log(`React  : ${FRONTEND_URL}`);
  console.log('===================================');
});
