import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import { promisify } from 'util';
import User from '../models/user.js';

export const authMiddleware = async (req, res, next) => {
    let token;
    if (req.cookies.access_token) {
        token = req.cookies.access_token;
    }
    if (!token) return next(new AppError('Not authorized,Please login', 401));
    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return next(new AppError('This user no longer exists', 401));
        req.user = user;
    } catch (error) {
        next(error);
    }
    next();
}

export const isAdmin = (req, res, next) => {
    const { role } = req.user;
    if (role === 'admin') {
        next()
    } else {
        next(new AppError('Not authrozied, Admin only', 403))
    }
}

