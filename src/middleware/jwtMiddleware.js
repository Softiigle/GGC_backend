const jwt = require('jsonwebtoken');
const { httpCodes } = require('../config');
const errorObjGenerator = require('./errorObjGenerator');

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error = errorObjGenerator(httpCodes.HTTP_UNAUTHORIZED, 'Authorization header missing or malformed.');
        return res.status(httpCodes.HTTP_UNAUTHORIZED).json(error);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        const error = errorObjGenerator(httpCodes.HTTP_UNAUTHORIZED, 'Access token is missing.');
        return res.status(httpCodes.HTTP_UNAUTHORIZED).json(error);
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.error('Access token expired:', error);
            const expiredError = errorObjGenerator(httpCodes.HTTP_FORBIDDEN, 'Access token has expired. Please use the refresh token to obtain a new access token.');
            return res.status(httpCodes.HTTP_FORBIDDEN).json(expiredError);
        } else {
            console.error('Invalid access token:', error);
            const invalidError = errorObjGenerator(httpCodes.HTTP_UNAUTHORIZED, 'Invalid or malformed access token.');
            return res.status(httpCodes.HTTP_UNAUTHORIZED).json(invalidError);
        }
    }
};

module.exports = verifyAccessToken;
