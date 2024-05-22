import express from 'express';
import { createCategory, listCategories, listCategory } from '../controllers/category.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/category', authMiddleware, createCategory);
router.get('/categories', authMiddleware, listCategories);
router.get('/category/:id', authMiddleware, listCategory);
export default router;