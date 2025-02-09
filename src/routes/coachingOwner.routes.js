const express = require('express');
const coachingOwnerRoutes = express.Router();
const CoachingOwnerController = require('../controller/coachingOwner.controller');


coachingOwnerRoutes.post('/register', CoachingOwnerController.registerCoachingOwner);
coachingOwnerRoutes.post('/login', CoachingOwnerController.loginCoachingOwner);
coachingOwnerRoutes.post('/otp-VeriFication', CoachingOwnerController.putOtpVeriFication);

module.exports = coachingOwnerRoutes;
