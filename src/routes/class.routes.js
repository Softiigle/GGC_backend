const express = require('express');
const classRoutes = express.Router();
const ClassController = require('../controller/class.controller');

// Create Class
classRoutes.post('/createClass/:ownerId', ClassController.createClass);

// Get All Classes
classRoutes.get('/getAllClasses/:ownerId', ClassController.getAllClasses);

module.exports = classRoutes;
