// /backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { login, logout, register, me } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, me); // Protected route

export const authRouter = router;