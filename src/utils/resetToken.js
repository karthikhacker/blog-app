import crypto from 'crypto';

export const resetToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    return crypto.createHash('sha256').update(token).digest('hex');

}