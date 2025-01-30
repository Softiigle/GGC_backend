const parseFile  = require('../utils/fileParser');
const fs = require('fs');
const db = require('../database');
const { httpCodes } = require('../config');
const errorObjGenerator = require('../middleware/errorObjGenerator');

const Test = db.Test;
const Question = db.Question;
const Option = db.Option;

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

module.exports = TestService;
