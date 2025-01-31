const parseFile  = require('../utils/fileParser');
const fs = require('fs');
const db = require('../database');
const { httpCodes } = require('../config');
const errorObjGenerator = require('../middleware/errorObjGenerator');
const { options } = require('../routes/test.routes');

const Test = db.Test;
const Question = db.Question;
const Option = db.Option;
const StudentResponse = db.StudentResponse;
const QuizResult = db.QuizResult;

class TestService {
  static createTest = async (testPayload) => {
    const { testName, coachingOwnerId, classId, scheduledAt, testTime, questionFilePath } = testPayload;

    try {
      // 1. Create a new Test
      const test = await Test.create({
        testName,
        coachingOwnerId,
        classId,
        scheduledAt,
        testTime,
      });

      // Parse questions from file
      const questions = parseFile(questionFilePath);

      // Use a single batch insert for all questions and options
      const questionsPromises = questions.map(async (question) => {
        // Create the question
        const createdQuestion = await Question.create({
          testId: test.testId,
          questionText: question.questionText,
          difficultyLevel: question.difficultyLevel,
        });

        console.log('Question Created:', createdQuestion);

        // Create the options in bulk for each question
        const optionsData = question.options.map((option) => ({
          questionId: createdQuestion.questionId,
          optionText: option.optionText,
          isCorrect: option.isCorrect,
        }));

        // Bulk insert options for the question
        await Option.bulkCreate(optionsData);
        console.log(`Options created for Question ID: ${createdQuestion.questionId}`);
      });

      // Wait for all question and option creations to finish
      await Promise.all(questionsPromises);

      // 2. Delete the uploaded file after successful processing
      fs.unlink(questionFilePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log(`File ${questionFilePath} deleted successfully.`);
        }
      });

      return test;  
    } catch (error) {
      console.error("Error while creating test:", error);
      throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
  };
}

TestService.getAllTestForTeacher = async (ownerId) => {
  try {
      const tests = await Test.findAll({ where: { coachingOwnerId: ownerId } });

      if (tests.length === 0) {  
          throw errorObjGenerator(httpCodes.HTTP_NOT_FOUND, 'No tests found for this teacher');
      }

      return tests;
  } catch (error) {
      console.error("Error while getting tests:", error);
      throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
  }
};

TestService.getAllTestForStudent = async (classId) => {
  try {
    const tests = await Test.findAll({ where: { classId: classId }});
  
  if (tests.length === 0) {  
      throw errorObjGenerator(httpCodes.HTTP_NOT_FOUND, 'No tests found for this student');
  }
  
  return tests;
  } catch (error) {
    console.error("Error while getting studen tests:", error);
    throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
  }
}

TestService.scheduleStudentTest = async (testId) => {
  try {
    
    const questions = await Question.findAll({where: { testId: testId },
      include: [{
        model: Option,
        as: 'options',
        attributes: { exclude: ['isCorrect'] }
      }]
    });

    if (questions.length === 0) {  
        throw errorObjGenerator(httpCodes.HTTP_NOT_FOUND, 'No questions found for this test');
    }

    return questions;

  } catch (error) {
    console.error("Error while scheduling student tests:", error);
    throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
  }
}

TestService.submitTestService = async (studentId, testResponseDaat) => {
  try {

    const testId = testResponseDaat.testId
   
    const questions = await Question.findAll({
      where: { testId: testId },
      include: [{
        model: Option,
        as: 'options',
        attributes: ['optionId', 'isCorrect'],
      }]
    });

    if(questions.length === 0){
      throw errorObjGenerator(httpCodes.HTTP_NOT_FOUND, 'questions not found'); 
    }

    let correctAnswer = 0;
    let totalQuestions = questions.length;

    let userResponse = testResponseDaat.responses

    for (const response of userResponse) {
      const question = questions.find(q => q.questionId === response.questionId);
      if (!question) {
        throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, 'Invalid question ID');
      }

      const correctOption = question.options.find(option => option.isCorrect);
      if (!correctOption) {
        throw errorObjGenerator(httpCodes.HTTP_INTERNAL_SERVER_ERROR, 'Correct option not found for question');
      }

      const isCorrect = response.selectedOptionId === correctOption.optionId;
      if (isCorrect) {
        correctAnswer++;
      }

      const studres = await StudentResponse.create({
        studentId: studentId,
        testId: testId,
        questionId: response.questionId,
        selectedOptionId: response.selectedOptionId,
        isCorrect: isCorrect,
        correctOptionId: correctOption.optionId
      });
    }

    const score = correctAnswer;

    console.log(`Score: ${score}`);

    const Quiz = await QuizResult.create({
      studentId: studentId,
      testId: testId,
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswer,
      score: score
    });
    
    return { message: "Test submitted successfully"};
    
  } catch (error) {
    throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
  }
}


module.exports = TestService;
