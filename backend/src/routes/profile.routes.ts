import { Router } from 'express';
import { getProfile, upsertProfile } from '../controllers/profile.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public — anyone can view the portfolio owner's profile
router.get('/', getProfile);

// Admin only — update profile
router.put('/', authenticate, requireAdmin, upsertProfile);

export default router;
