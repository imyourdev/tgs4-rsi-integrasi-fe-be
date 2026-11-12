
import { Router } from 'express';
import { AssignmentController } from '../controllers/assignmentController.ts';
import { requireAuth } from '../middlewares/authMiddleware.ts';
import { requireRole } from '../middlewares/roleMiddleware.ts';

const assignmentRouter = Router();
const controller = new AssignmentController();

// USERS
assignmentRouter.get(
  '/users',
  requireAuth,
  requireRole('admin'),
  (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.responses[200] = { description: 'Daftar pengguna tanpa password hash' }
    // #swagger.responses[401] = { description: 'Belum login' }
    // #swagger.responses[403] = { description: 'Hanya admin' }
    return controller.getUsers(req, res);
  }
);

// Nonaktifkan jalur lama yang menerima passwordHash dari body.
// Pembuatan akun dilakukan melalui /auth/register.
assignmentRouter.post('/users', requireAuth, (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.security = [{ bearerAuth: [] }]
  // #swagger.responses[410] = { description: 'Gunakan endpoint auth/register' }
  return res.status(410).json({
    status: 'fail',
    message: 'Endpoint lama dinonaktifkan. Gunakan /api/v1/auth/register',
  });
});

// MENU ITEMS - BACA PUBLIK
assignmentRouter.get('/menu-items', (req, res) => {
  // #swagger.tags = ['Menu Items']
  // #swagger.parameters['stallId'] = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar menu beserta warung' }
  return controller.getMenuItems(req, res);
});

assignmentRouter.get('/menu-items/:id', (req, res) => {
  // #swagger.tags = ['Menu Items']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  return controller.getMenuItem(req, res);
});

// MENU ITEMS - SEMENTARA ADMIN ONLY
// Owner belum diizinkan lewat jalur ini karena pemeriksaan
// kepemilikan menu/warung belum tersedia.
assignmentRouter.post(
  '/menu-items',
  requireAuth,
  requireRole('admin'),
  (req, res) => {
    // #swagger.tags = ['Menu Items']
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
    // #swagger.responses[201] = { description: 'Menu dibuat' }
    // #swagger.responses[403] = { description: 'Hanya admin' }
    return controller.createMenuItem(req, res);
  }
);

assignmentRouter.put(
  '/menu-items/:id',
  requireAuth,
  requireRole('admin'),
  (req, res) => {
    // #swagger.tags = ['Menu Items']
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
    // #swagger.responses[403] = { description: 'Hanya admin' }
    return controller.updateMenuItem(req, res);
  }
);

assignmentRouter.delete(
  '/menu-items/:id',
  requireAuth,
  requireRole('admin'),
  (req, res) => {
    // #swagger.tags = ['Menu Items']
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[403] = { description: 'Hanya admin' }
    return controller.deleteMenuItem(req, res);
  }
);

// REVIEWS - BACA PUBLIK
assignmentRouter.get('/reviews', (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.parameters['stallId'] = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar ulasan' }
  return controller.getReviews(req, res);
});

// Jalur review lama hanya untuk admin.
// Customer menggunakan POST /stalls/:id/reviews.
assignmentRouter.post(
  '/reviews',
  requireAuth,
  requireRole('admin'),
  (req, res) => {
    // #swagger.tags = ['Reviews']
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ReviewInput' } }
    // #swagger.responses[403] = { description: 'Hanya admin' }
    return controller.createReview(req, res);
  }
);

assignmentRouter.delete(
  '/reviews/:id',
  requireAuth,
  requireRole('admin'),
  (req, res) => {
    // #swagger.tags = ['Reviews']
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    return controller.deleteReview(req, res);
  }
);

// LIKES - USER LOGIN
assignmentRouter.post(
  '/likes',
  requireAuth,
  (req, res) => {
    // #swagger.tags = ['Likes']
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LikeInput' } }
    // #swagger.responses[201] = { description: 'Like dibuat' }
    return controller.createLike(req, res);
  }
);

assignmentRouter.delete(
  '/likes/:id',
  requireAuth,
  (req, res) => {
    // #swagger.tags = ['Likes']
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Like dihapus' }
    // #swagger.responses[403] = { description: 'Bukan pemilik like' }
    // #swagger.responses[404] = { description: 'Like tidak ditemukan' }
    return controller.deleteLike(req, res);
  }
);

// FLAGS - ADMIN
assignmentRouter.get(
  '/flags',
  requireAuth,
  requireRole('admin'),
  (req, res) => {
    // #swagger.tags = ['Flags']
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.parameters['status'] = { in: 'query', type: 'string', enum: ['pending', 'resolved', 'dismissed'] }
    return controller.getFlags(req, res);
  }
);

assignmentRouter.put(
  '/flags/:id',
  requireAuth,
  requireRole('admin'),
  (req, res) => {
    // #swagger.tags = ['Flags']
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/FlagStatusInput' } }
    return controller.updateFlagStatus(req, res);
  }
);

// AUDIT LOGS - ADMIN
assignmentRouter.get(
  '/audit-logs',
  requireAuth,
  requireRole('admin'),
  (req, res) => {
    // #swagger.tags = ['Audit Logs']
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.parameters['userId'] = { in: 'query', type: 'integer' }
    // #swagger.parameters['targetTable'] = { in: 'query', type: 'string' }
    return controller.getAuditLogs(req, res);
  }
);

assignmentRouter.post(
  '/audit-logs',
  requireAuth,
  requireRole('admin'),
  (req, res) => {
    // #swagger.tags = ['Audit Logs']
    // #swagger.security = [{ bearerAuth: [] }]
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuditLogInput' } }
    return controller.createAuditLog(req, res);
  }
);

export { assignmentRouter };
