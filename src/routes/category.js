import express from 'express';
import { createCategory, listCategories, listCategory } from '../controllers/category.js';

const router = express.Router();
router.post('/category', createCategory);
router.get('/categories', listCategories);
router.get('/category/:id', listCategory);
export default router;