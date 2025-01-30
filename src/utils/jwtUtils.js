const jwt = require('jsonwebtoken');
const errorObjGenerator = require('../middleware/errorObjGenerator');
const { httpCodes } = require('../config');

const generateAccessToken = (user) => {
    validateUser(user);

    try {
        return jwt.sign(
            { userId: user.userId, email: user.email }, 
            process.env.ACCESS_TOKEN_SECRET,           
            { expiresIn: '15m' }                        
        );
    } catch (error) {
        console.error('Error generating access token:', error);
        throw errorObjGenerator(httpCodes.HTTP_INTERNAL_SERVER_ERROR, 'Failed to generate access token.');
    }
};

const generateRefreshToken = (user) => {
    validateUser(user);

    try {
        return jwt.sign(
            { userId: user.userId, email: user.email }, 
            process.env.REFRESH_TOKEN_SECRET,           
            { expiresIn: '7d' }                         
        );
    } catch (error) {
        console.error('Error generating refresh token:', error);
        throw errorObjGenerator(httpCodes.HTTP_INTERNAL_SERVER_ERROR, 'Failed to generate refresh token.');
    }
};

const validateUser = (user) => {
    if (!user || typeof user !== 'object' || !user.userId || !user.email) {
        throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, 'User object must contain userId and email');
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
