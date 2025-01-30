const express = require('express');
const studentRoutes = express.Router();
const { CoachingOwner } = require('../database');
const StudentController = require('../controller/student.controller');

// Create Student
studentRoutes.post('/createStudent/:ownerId', StudentController.createStudent);
studentRoutes.get('/students/:ownerId/:classId?', StudentController.getStudents);
studentRoutes.post('/login', StudentController.loginStudent);






module.exports = studentRoutes;
