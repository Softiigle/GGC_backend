const express = require('express');
const testRoutes = express.Router();
const { uploadSingleFile } = require('../service/fileUpload.Service');
const TestController = require('../controller/test.controller')

testRoutes.post('/create-test/:ownerId', uploadSingleFile, TestController.createTest);
testRoutes.get('/get-test/teacher', TestController.gettAllTestTeachrs);
testRoutes.get('/get-test/student', TestController.getAlltestStudent);
testRoutes.get('/schedule-test/student', TestController.scheduleStudentTest);
testRoutes.post('/submit-test', TestController.submitTestController);


module.exports = testRoutes;
