const { httpMsg } = require('../config'); 

const errorObjGenerator = (statusCode, customMessage) => {
    const message = customMessage || httpMsg[statusCode] || 'An unexpected error occurred.';
    const error = new Error(message);
    error.statusCode = statusCode;

    console.error(`Error generated: ${error.message}`);

    return error;
};

module.exports = errorObjGenerator;