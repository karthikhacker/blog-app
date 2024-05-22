import User from '../models/user.js';
import AppError from '../utils/appError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    try {
        const { name, email, password, photo } = req.body;
        const user = await User.findOne({ email });
        if (user) return next(new AppError('User exists with this email.', 400));
        const salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hash,
            photo
        });
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
        res.status(201).json({
            message: 'User signup successfull',
            data: {
                token,
                savedUser
            }
        })
    } catch (error) {
        next(error);
    }
}