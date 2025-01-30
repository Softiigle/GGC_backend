const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_ENABLED === 'true', 
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});


transporter.verify((error, success, next) =>{
    if(error){
        console.error('Error with SMTP configuration:', error)
    }
});


module.exports = transporter;
