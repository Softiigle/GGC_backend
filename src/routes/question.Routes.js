const express = require('express');
const { uploadQuestions } = require('../controller/question.Controller');
const { uploadSingleFile } = require('../service/fileUpload.Service');
const db = require('../database/index')

const CoachingOwner = db.coachingOwner;



const questionRouter = express.Router();

// POST route to upload file and process questions
questionRouter.post('/upload', uploadSingleFile, uploadQuestions);
questionRouter.post('/createCoachingOwner', async (req, res) => {
  try {
    const { name, email, phone, password, coachingName, address } = req.body;

    if (!name || !email || !phone || !password || !coachingName) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields.',
      });
      
    }

    // Create new Coaching Owner
    const newCoachingOwner = await CoachingOwner.create({
      name,
      email,
      phone,
      password,
      coachingName,
      address,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Coaching Owner created successfully.',
      data: newCoachingOwner,
    });
  } catch (error) {
    console.error('Error while creating coaching owner:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error while creating coaching owner.',
    });
  }
});




module.exports = questionRouter;
