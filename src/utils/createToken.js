import jwt from 'jsonwebtoken';

const createToken = (id, secret, tokenExpiry) => {
    return jwt.sign({ id }, secret, { expiresIn: tokenExpiry });
}

export default createToken;