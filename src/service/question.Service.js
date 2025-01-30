const db = require('../database/index');
const { parseFile } = require('../utils/fileParser');

// Function to upload questions from the file
const uploadQuestionsFromFile = async (filePath) => {
    try {
        // Parse the file to get questions
        const questions = parseFile(filePath);  
        console.log("uploaded question from the txt file=-=-=-=>",JSON.stringify(questions, null, 2))

        if (!questions || questions.length === 0) {
            throw new Error("No questions found in the file.");
        }

        for (let question of questions) {
            try {
                // Save the question to the database
                const createdQuestion = await db.Question.create({
                    category: question.category.length > 500 ? question.category.slice(0, 500) : question.category, // Ensure category does not exceed 500 chars
                    questionText: question.questionText,
                    difficultyLevel: question.difficultyLevel || 'Medium',
                });

                // Save options for the question
                for (let option of question.options) {
                    await db.Option.create({
                        questionId: createdQuestion.questionId,
                        optionText: option.optionText,
                        isCorrect: option.isCorrect,
                    });
                }

                // Save the explanation for the question
                await db.AnswerExplanation.create({
                    questionId: createdQuestion.questionId,
                    explanationText: question.explanationText,
                });
            } catch (err) {
                // Handle any error that occurs while inserting a single question and options
                console.error(`Error inserting question with category ${question.category}: ${err.message}`);
                throw new Error(`Failed to insert question with category ${question.category}: ${err.message}`);
            }
        }

        return { message: 'Questions uploaded successfully!' };
    } catch (err) {
        // Handle any general error that occurs during file processing
        console.error(`Error processing file at ${filePath}: ${err.message}`);
        throw new Error(`Error uploading questions: ${err.message}`);
    }
};

module.exports = {
    uploadQuestionsFromFile,
};
