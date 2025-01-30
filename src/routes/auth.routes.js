const authRoutes = require('express').Router();
const AuthController = require('../controller/auth.controller');
const verification = require('../middleware/jwtMiddleware')


authRoutes.post('/register', AuthController.registrationController); 
authRoutes.post('/login', AuthController.loginController);
authRoutes.post('/refreshtoken', AuthController.refreshTokenController);
authRoutes.post('/otpverification/:userId', AuthController.otpVerificationController);
authRoutes.post('/logout', verification, AuthController.logoutController);
authRoutes.post('/forgetPassword',AuthController.forgotPasswordController);
authRoutes.post('/resetPassword', AuthController.resetPasswordController);
authRoutes.post('/resendotp', AuthController.resendOtpController);

module.exports = authRoutes; 
