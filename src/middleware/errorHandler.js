const { httpCodes, httpMessages } = require('../config');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR;
    const message = err.message || httpMessages[httpCodes.HTTP_INTERNAL_SERVER_ERROR];

    console.error(`Error caught: ${message}`, err);

    res.status(statusCode).json({
        status: 'error',
        message,
    });
};

module.exports = errorHandler;


