const transporter = require('../config/nodemailerConfig');
const { renderTemplate } = require('./templateService');

const sendOtpEmail = async (to, sub, otp) => {
    const htmlContent = await renderTemplate('otpTemplate', { otp });

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject: sub,
        html: htmlContent,
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log(`otp email sent to ${to}`);
    }catch(error){
        console.error(`Error sending otp to ${to}:`, error);
    }
}

const sendWelcomeEmail = async (to, sub) => {
    const htmlContent = await renderTemplate('welcomeEmailTemplate', { to });

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject: sub,
        html: htmlContent,
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log(`welcome email sent to ${to}`);
        return true;
    }catch(error){
        console.error(`Error sending otp to ${to}:`, error);
    }
}

const forgetPasswordEmail = async (to, sub, otp) => {
    const htmlContent = await renderTemplate('forgetPassword', { to, otp });

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject: sub,
        html: htmlContent,
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log(`Forget password email sent to ${to}`);
        return true;
    }catch(error){
        console.error(`Error sending otp to ${to}:`, error);
    }
}

const resetPasswordEmail = async (to, sub) => {
    const htmlContent = await renderTemplate('resetPassword', { to });

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject: sub,
        html: htmlContent,
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log(`Reset password email sent to ${to}`);
        return true;
    }catch(error){
        console.error(`Error sending otp to ${to}:`, error);
    }
}

module.exports = {
    sendOtpEmail,
    sendWelcomeEmail,
    forgetPasswordEmail,
    resetPasswordEmail
}