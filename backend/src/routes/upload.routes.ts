import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { upload, uploadImage } from '../controllers/upload.controller';

const router = Router();

// Admin only — upload image to Cloudinary
router.post('/', authenticate, requireAdmin, upload.single('image'), uploadImage);

export default router;
