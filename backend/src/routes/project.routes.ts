import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/project.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public
router.get('/', getProjects);
router.get('/categories', getCategories);
router.get('/:id', getProjectById);

// Admin only
router.post('/', authenticate, requireAdmin, createProject);
router.put('/:id', authenticate, requireAdmin, updateProject);
router.delete('/:id', authenticate, requireAdmin, deleteProject);

// Category management (admin only)
router.post('/categories', authenticate, requireAdmin, createCategory);
router.delete('/categories/:id', authenticate, requireAdmin, deleteCategory);

export default router;
