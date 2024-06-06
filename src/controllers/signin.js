import User from '../models/user.js';
import AppError from '../utils/appError.js';
import bcrypt from 'bcryptjs';
import createToken from '../utils/createToken.js';
import sendMail from '../utils/email.js';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { filterObj } from '../utils/filterObj.js';

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) return next(new AppError('Please provide email and password.', 400));

    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new AppError('User not found', 404));
    const dbPassword = await bcrypt.compare(password, user.password);
    if (!dbPassword) return next(new AppError('Password didnt match', 401));
    createToken(user._id, process.env.JWT_SECRET, process.env.JWT_EXPIRES, res);
    res.status(201).json({
        message: 'Login successfull',
        user
    })
}

export const loggedInUser = (req, res) => {
    res.json({ data: req.user });
}

export const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(new AppError('User not found with this email', 404));
        const token = createToken(user._id, process.env.JWT_PASSWORD_SECRET, process.env.JWT_PASSWORD_EXPIRES);
        const restUrl = `http://localhost:4000/v1/api/reset/password/${token}`;
        const message = `Password reset link sent to ${req.body.email}`
        await sendMail({
            email: req.body.email,
            subject: 'Password reset link',
            text: restUrl
        })

        await user.updateOne({ password_reset_token: token, passwordResetExpires: Date.now() + 10 * 60 * 1000 });
        res.status(200).json({
            message: `Password reset link sent to ${req.body.email}`,
        })
    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const user = await User.findOne({ password_reset_token: req.params.token, passwordResetExpires: { $gt: Date.now() } });
        if (!user) return next(new AppError('Password link expired', 400))
        if (newPassword !== confirmPassword) return next(new AppError('Password didnt match', 400));

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        user.password = hash;
        user.password_reset_token = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        res.status(201).json({ message: 'Password updated successfully' });

    } catch (error) {
        next(error)
    }
}

export const updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        if (!user) return next(new AppError("User not found", 404));

        const comparePassword = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!comparePassword) return next(new AppError('Old password didnt match', 401));
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Password updated.' })
    } catch (error) {
        next(error);
    }
}


export const updateMe = async (req, res, next) => {
    try {
        const filteredFields = filterObj(req.body, 'name', 'photo');
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredFields, { new: true, runValidators: true })
        res.status(200).json({
            message: "Updated.",
            data: updatedUser
        })
    } catch (error) {
        next(error)
    }
}

export const deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { active: false });
        res.status(204).json({ message: 'Account deleted' })
    } catch (error) {
        next(next)
    }
}

export const logout = (req, res, next) => {
    try {
        res.clearCookie('access_token');
        return res.status(200).json({ message: "Logout successfull" });
    } catch (error) {
        next(error)
    }

}