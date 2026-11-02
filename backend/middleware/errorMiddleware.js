const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : (err.code === 11000 ? 409 : (res.statusCode !== 200 ? res.statusCode : 500)));

    res.status(statusCode).json({
        mensaje: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = {
    errorHandler
};
