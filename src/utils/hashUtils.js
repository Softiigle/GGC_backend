const bcrypt = require('bcrypt');
const { httpCodes } = require('../config');
const errorObjGenerator = require('../middleware/errorObjGenerator');

const hashPassword = async (password) => {
    if (!password || typeof password !== 'string') {
        throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, 'Password is required and must be a string.');
    }

    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw errorObjGenerator(httpCodes.HTTP_INTERNAL_SERVER_ERROR, 'Failed to hash password.');
    }
};

const comparePassword = async (plainPassword, hashedPassword) => {
    if (!plainPassword || typeof plainPassword !== 'string') {
        throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, 'Plain password is required and must be a string.');
    }
    if (!hashedPassword || typeof hashedPassword !== 'string') {
        throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, 'Hashed password is required and must be a string.');
    }

    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw errorObjGenerator(httpCodes.HTTP_INTERNAL_SERVER_ERROR, 'Failed to compare passwords.');
    }
};

module.exports = {
    hashPassword,
    comparePassword,
};
