const express = require('express');
const coachingOwnerRoutes = express.Router();
const CoachingOwnerController = require('../controller/coachingOwner.controller');

// Register Coaching Owner
coachingOwnerRoutes.post('/register', CoachingOwnerController.registerCoachingOwner);

// Login Coaching Owner
coachingOwnerRoutes.post('/login', CoachingOwnerController.loginCoachingOwner);

module.exports = coachingOwnerRoutes;
