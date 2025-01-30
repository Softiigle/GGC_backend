const express = require('express');
const testRoutes = express.Router();
const { uploadSingleFile } = require('../service/fileUpload.Service');
const TestController = require('../controller/test.controller')

testRoutes.post('/create-test/:ownerId', uploadSingleFile, TestController.createTest);

module.exports = testRoutes;
