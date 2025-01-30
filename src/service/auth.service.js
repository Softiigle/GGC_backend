const db = require('../database/index');
const { generateOtp, getOtpExpiryTime } = require('../utils/otpUtils');
const { hashPassword, comparePassword } = require('../utils/hashUtils');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtUtils')
const { httpCodes, httpMsg } = require('../config');
const errorObjGenerator = require('../middleware/errorObjGenerator'); 
const emailService = require('../helper/emailService');
const jwtUtils = require('../utils/jwtUtils')
const jwt = require('jsonwebtoken');

const Users = db.user;

class AuthService {}

AuthService.registrationService = async ({ number, email, password }) => {
    try {
        if (!number || !email || !password) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, "Missing required fields.");
        }

        const existingUser = await Users.findOne({ where: { email: email } });
        const existingUserWithNumber = await Users.findOne({ where: { number } });

        if (existingUser && !existingUser.emailVerified) {
            const otp = generateOtp();
            const otpExpiryTime = getOtpExpiryTime();

            existingUser.emailOtp = otp;
            existingUser.emailOtpExpiryTime = otpExpiryTime;
            

            await existingUser.save();
            await emailService.sendOtpEmail(email, "Otp Verification", otp);

            return {
                userId: existingUser.userId,
                email: existingUser.email,
                number: existingUser.number,
                registrationMethod: existingUser.registrationMethod,
                message: 'OTP sent to existing user',
            };
        }

        if (existingUser && existingUser.emailVerified) {
            throw errorObjGenerator(httpCodes.HTTP_CONFLICT, "This email is already registered.");
        }

        if (existingUserWithNumber) {
            throw errorObjGenerator(httpCodes.HTTP_CONFLICT, "This phone number is already registered.");
        }

        const hashedPassword = await hashPassword(password);
        const otp = generateOtp();
        const otpExpiryTime = getOtpExpiryTime();

        const newUser = await Users.create({
            email,
            number,
            password: hashedPassword,
            emailOtp: otp,
            emailOtpExpiryTime: otpExpiryTime,
            registrationMethod: 'manual'
        });

        await emailService.sendOtpEmail(email, "Otp Verification", otp);

        return {
            userId: newUser.userId,
            email: newUser.email,
            number: newUser.number,
            registrationMethod: newUser.registrationMethod,
            message: 'User registered successfully. OTP sent.',
        };
    } catch (error) {
        console.error("Error while registering the user:", error);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};
AuthService.loginService = async (data) => {
    try {
        const { email, password } = data;

        if (!email || !password) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, "Email and password are required.");
        }
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            throw errorObjGenerator(httpCodes.HTTP_UNAUTHORIZED, "Invalid email or password.");
        }

        if (!user.emailVerified) {
            throw errorObjGenerator(httpCodes.HTTP_FORBIDDEN, "Email not verified. Please verify your email to log in.");
        }

        const isPasswordMatch = await comparePassword(password, user.password);
        if (!isPasswordMatch) {
            throw errorObjGenerator(httpCodes.HTTP_UNAUTHORIZED, "Invalid email or password.");
        }
        let accessToken, refreshToken;
        try {
            accessToken = generateAccessToken(user);
            refreshToken = generateRefreshToken(user);
        } catch (tokenError) {
            console.error("Error generating tokens:", tokenError);
            throw errorObjGenerator(httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
        }

        const updates = {
            lastLogin: new Date(),
            refreshToken: refreshToken,
        };

        try {
            await user.update(updates);
        } catch (updateError) {
            console.error("Error updating user:", updateError);
            throw errorObjGenerator(httpCodes.HTTP_INTERNAL_SERVER_ERROR, "Failed to update user login details.");
        }

        return {
            accessToken,
            refreshToken,
            message: "Login successful.",
        };
    } catch (error) {
        console.error("Error during login:", error);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};
AuthService.refreshTokenService = async (refreshToken) => {
    try {
        if (!refreshToken) {
            throw errorObjGenerator(httpCodes.HTTP_UNAUTHORIZED, "No refresh token provided.");
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw errorObjGenerator(httpCodes.HTTP_UNAUTHORIZED, "Session has expired. Please log in again.");
            }
            throw errorObjGenerator(httpCodes.HTTP_UNAUTHORIZED, "Invalid refresh token.");
        }
        const user = await Users.findOne({ where: { userId: decoded.userId } });

        if (!user || user.refreshToken !== refreshToken) {
            throw errorObjGenerator(httpCodes.HTTP_UNAUTHORIZED, "Invalid or mismatched refresh token.");
        }

        const newAccessToken = generateAccessToken(user);

        return {
            accessToken: newAccessToken,
            message: 'Access token refreshed successfully.',
        };
    } catch (error) {
        console.error("Error during token refresh:", error.message);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};
AuthService.otpVerificationService = async (userId, otp) => {
    try {
        const user = await Users.findOne({ where: { userId } });

        if (!user) {
            throw errorObjGenerator(httpCodes.HTTP_NOT_FOUND, "User not found.");
        }

        const currentDateTime = new Date();
        const otpExpiryTime = new Date(user.emailOtpExpiryTime);

        if (currentDateTime.getTime() > otpExpiryTime.getTime()) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, "OTP expired.");
        }

        if (user.emailOtp !== otp) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, "Invalid OTP.");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const emailSent = await emailService.sendWelcomeEmail(user.email, "OTP Verification Successful");
        if (!emailSent) {
            console.warn("Welcome email not sent. Consider handling this scenario.");
        }

        await Users.update(
            {
                emailVerified: true,
                emailOtp: null,
                emailOtpExpiryTime: null,
                refreshToken: refreshToken,
                lastLogin: new Date(),
            },
            { where: { userId } }
        );

        return {
            accessToken,
            refreshToken,
            message: 'OTP verification successful, welcome!',
        };
    } catch (error) {
        console.error("Error during OTP verification:", error.message);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};
AuthService.logoutService = async (userId) => {
    try {
        const user = await Users.findOne({ where: { userId } });

        if (!user) {
            throw errorObjGenerator(httpCodes.HTTP_NOT_FOUND, "User not found.");
        }
        await Users.update({ refreshToken: null }, { where: { userId } });

        return {
            message: "Logged out successfully.",
        };
    } catch (error) {
        console.error("Error during logout:", error.message);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};
AuthService.forgotPasswordService = async (email) => {
    try {
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            throw errorObjGenerator(httpCodes.HTTP_NOT_FOUND, 'User with this email not found.');
        }

        const otp = generateOtp();
        const otpExpiryTime = getOtpExpiryTime();

        user.emailOtp = otp;
        user.emailOtpExpiryTime = otpExpiryTime;

        await user.save();

        const emailSent = await emailService.forgetPasswordEmail(email, 'Password Reset OTP', otp);

        if (!emailSent) {
            console.warn('Failed to send password reset email');
            throw errorObjGenerator(httpCodes.HTTP_INTERNAL_SERVER_ERROR, 'Failed to send password reset email. Please try again.');
        }

        return {
            message: 'Password reset OTP sent to your email.',
        };

    } catch (error) {
        console.error('Error during password reset process:', error.message);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};
AuthService.resetPasswordService = async (otp, newPassword, email) => {
    try {
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            throw errorObjGenerator(httpCodes.HTTP_NOT_FOUND, "User not found.");
        }

        const currentDateTime = new Date();
        const otpExpiryTime = new Date(user.emailOtpExpiryTime);

        if (currentDateTime.getTime() > otpExpiryTime.getTime()) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, "OTP has expired.");
        }

        if (user.emailOtp !== otp) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, "Invalid OTP.");
        }

        const hashedPassword = await hashPassword(newPassword);

        user.password = hashedPassword;
        user.emailOtp = null;
        user.emailOtpExpiryTime = null;

        await user.save();

        const emailSent = await emailService.resetPasswordEmail(user.email, "Password Reset Successful");

        if (!emailSent) {
            console.warn("Password reset email not sent. Handle this scenario.");
        }

        return {
            message: 'Password reset successfully. Please log in with your new password.',
        };
    } catch (error) {
        console.error('Error resetting password:', error.message);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};

AuthService.resendOtpService = async ({ email, type }) => {
    try {
        
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            throw errorObjGenerator(httpCodes.HTTP_NOT_FOUND, 'User with this email not found.');
        }

        if (type === 'registrationOtp' && user.emailVerified) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, 'This email is already verified. No need to resend OTP.');
        }

        const otp = generateOtp();
        const otpExpiryTime = getOtpExpiryTime();

        user.emailOtp = otp;
        user.emailOtpExpiryTime = otpExpiryTime;
        await user.save();

        if (type === 'registrationOtp') {
            await emailService.sendOtpEmail(email, "Resend email verification OTP", otp);
        } else if (type === 'forgetPasswordOtp') {
            await emailService.forgetPasswordEmail(email, 'Resend forget password OTP', otp);
        }

        return {
            message: 'OTP resent successfully.',
        };
    } catch (error) {
        console.error("Error while resending OTP:", error.message);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};


module.exports = AuthService;
