import AppError from '../utils/appError.js';

const handleCastError = err => {
    const message = ` Invalid ${err.path}: ${err.value?._id} `;
    return new AppError(message, 400);
}

const handleDuplicateFields = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value ${value}  please use another title`;
    return new AppError(message, 400);
}

const handleValidationError = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input ${errors.join(', ')}`;
    return new AppError(message, 400);
}
const devError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}
const prodError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong.'
        })
    }

}
export const errController = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        if (err.name === 'CastError') err = handleCastError(err)
        devError(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        if (err.name === 'CastError') err = handleCastError(err);
        if (err.code === 11000) err = handleDuplicateFields(err);
        if (err.name === 'ValidationError') err = handleValidationError(err);
        prodError(err, res)
    }

}