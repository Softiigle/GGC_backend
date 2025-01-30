const AuthService = require('../service/auth.service');
const { httpCodes } = require('../config');

class AuthController {}

AuthController.registrationController = async (req, res, next) => {
    try {
        const authData = req.body;

        const user = await AuthService.registrationService(authData);

        res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            data: {
                userId: user.userId,
                email: user.email,
                number: user.number,
                registrationMethod: user.registrationMethod,
                message: user.message, 
            },
        });
    } catch (error) {
        console.error("Registration error:", error.message);
        next(error);
    }
};

AuthController.loginController = async (req, res, next) => {
    try {
        const loginData = req.body;

        const user = await AuthService.loginService(loginData);

        res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            data: {
                accessToken: user.accessToken,
                refreshToken: user.refreshToken,
                message: user.message,  
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);
        next(error);
    }
};

AuthController.refreshTokenController = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const data = await AuthService.refreshTokenService(refreshToken);

        res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            data: {
                accessToken: data.accessToken,
                userId: data.userId,
                email: data.email,
                message: data.message,
            },
        });
    } catch (error) {
        console.error("Error in refresh token controller:", error.message);
        next(error);
    }
};
AuthController.otpVerificationController = async (req, res, next) => {
    try {

        
        const { userId } = req.params;  
        const { otp } = req.body;       


        const responseData = await AuthService.otpVerificationService(userId, otp);

        res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            message: responseData.message, 
            data: {
                accessToken: responseData.accessToken,
                refreshToken: responseData.refreshToken,
            },
        });


    } catch (error) {
        console.error("Error in OTP verification controller:", error.message);
        next(error);
    }
};


AuthController.logoutController = async (req, res, next) => {
    try {
        const { userId } = req.user; 

        const responseData = await AuthService.logoutService(userId);

        res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            message: responseData.message,
        });
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        next(error);
    }
};

AuthController.forgotPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(httpCodes.HTTP_BAD_REQUEST).json({
                success: false,
                message: 'Email is required to reset the password.',
            });
        }

        const response = await AuthService.forgotPasswordService(email);

        return res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            message: response.message,
        });
    } catch (error) {
        next(error);
    }
};

AuthController.resetPasswordController = async (req, res, next) => {
    try {
        const { otp, newPassword, email } = req.body;

        const response = await AuthService.resetPasswordService(otp, newPassword, email);

        return res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            message: response.message,
        });
    } catch (error) {
        next(error); 
    }
};

AuthController.resendOtpController = async (req, res, next) => {
    try {
        const { email, type } = req.body;

        if (!email || !type) {
            return res.status(httpCodes.HTTP_BAD_REQUEST).json({
                status: 'fail',
                message: 'Email and type are required fields.',
            });
        }

        const validTypes = ['registrationOtp', 'forgetPasswordOtp'];
        if (!validTypes.includes(type)) {
            return res.status(httpCodes.HTTP_BAD_REQUEST).json({
                status: 'fail',
                message: "Invalid type.",
            });
        }

        const response = await AuthService.resendOtpService({ email, type });

        return res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            message: response.message,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = AuthController;

