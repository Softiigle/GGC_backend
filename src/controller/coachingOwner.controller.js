const CoachingOwnerService = require('../service/coachingOwner.service');
const { httpCodes } = require('../config');
const { coachingOwner } = require('../database');

class CoachingOwnerController {}

CoachingOwnerController.registerCoachingOwner = async (req, res) => {
    try {
        const coachingOwner = await CoachingOwnerService.registerCoachingOwner(req.body);

        return res.status(httpCodes.HTTP_CREATED).json({
            status: "success",
            message: "Coaching Owner registered successfully.",
            data: coachingOwner,
        });
    } catch (error) {
        return res.status(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message,
        });
    }
};

CoachingOwnerController.loginCoachingOwner = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const coachingOwner = await CoachingOwnerService.loginCoachingOwner({ email, password });

        return res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            message: 'Login successful.',
            data: coachingOwner,
        });
    } catch (error) {
        next(error);
    }
};


CoachingOwnerController.putOtpVeriFication = async (req, res, next) => {
    try {
        const { userId, otp } = req.body;

        const coachingOwner = await CoachingOwnerService.putOtpVerification(userId, otp);

        return res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            message: 'OTP verification successful.',
            data: coachingOwner,
        });
    } catch (error) {
        
    }
}

module.exports = CoachingOwnerController;
