import User from '../models/user.js';
import AppError from '../utils/appError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createToken from '../utils/createToken.js';

export const signup = async (req, res, next) => {
    try {
        const { name, email, password, photo } = req.body;
        if (!name) return next(new AppError('Name is required', 400));
        if (!email) return next(new AppError('Email is required', 400))
        const user = await User.findOne({ email });
        if (user) return next(new AppError('User exists with this email.', 400));
        const salt = await bcrypt.genSalt(10);
        if (!password) return next(new AppError('Password is required', 400))
        let hash = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hash,
            photo
        });
        const savedUser = await newUser.save();
        createToken(savedUser._id, process.env.JWT_SECRET, process.env.JWT_EXPIRES, res);

        res.status(201).json({
            message: 'User signup successfull',
            data: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        })
    } catch (error) {
        next(error);
    }
}