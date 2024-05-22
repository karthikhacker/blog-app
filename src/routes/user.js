import express from 'express';
import { signup } from '../controllers/user.js';
import { deleteMe, forgotPassword, loggedInUser, login, resetPassword, updateMe, updatePassword } from '../controllers/signin.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, loggedInUser);
router.post('/forgot/password', forgotPassword);
router.post('/reset/password/:token', resetPassword);
router.post('/update/password', authMiddleware, updatePassword);
router.post('/update', authMiddleware, updateMe);
router.post('/delete', authMiddleware, deleteMe);
export default router;