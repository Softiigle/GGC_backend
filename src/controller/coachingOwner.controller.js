const CoachingOwnerService = require('../service/coachingOwner.service');
const { httpCodes } = require('../config');

class CoachingOwnerController {}

CoachingOwnerController.registerCoachingOwner = async (req, res, next) => {
    try {
        const ownerData = req.body;

        const coachingOwner = await CoachingOwnerService.registerCoachingOwner(ownerData);

        return res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            message: 'Coaching Owner registered successfully.',
            data: coachingOwner,
        });
    } catch (error) {
        next(error);
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

module.exports = CoachingOwnerController;
