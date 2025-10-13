// path: backend/src/routes/click.routes.ts
import { Router } from 'express';
import clickController from '../controllers/click.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/', clickController.createClick);
router.get('/r/:clickToken', clickController.processRedirect);

// Protected routes
router.get('/stats', authenticateToken, clickController.getClickStats);

export default router;