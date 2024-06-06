import jwt from 'jsonwebtoken';

const createToken = (id, secret, tokenExpiry, res) => {
    const token = jwt.sign({ id }, secret, { expiresIn: tokenExpiry });
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
}

export default createToken;