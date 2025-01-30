const fs = require('fs');

const parseFile = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf-8');
    const questions = [];
    const questionRegex = /\d+\.\s+Category:\s+([^\r\n]+)\s+Question Text:\s+([^\r\n]+)\s+Difficulty Level:\s+(\w+)\s+Options:\s+([\s\S]+?)Correct Answer:\s+([A-Z])/gm;

    let match;
    while ((match = questionRegex.exec(data)) !== null) {
        const category = match[1].trim();
        const questionText = match[2].trim();
        const difficultyLevel = match[3].trim();
        const correctAnswer = match[5].trim();

        // Parse the options
        const options = match[4]
            .trim()
            .split('\n')
            .filter(Boolean)
            .map((optionText) => {
                const optionLabel = optionText.split('. ')[0].trim(); // A, B, C, D
                const optionLabelIndex = optionLabel.charCodeAt(0) - 65; // Convert 'A' to 0, 'B' to 1, etc.

                return {
                    optionText: optionText.slice(3).trim(), // Remove the option label and the space
                    isCorrect: optionLabel === correctAnswer, // Check if this option matches the correct answer
                };
            });



        questions.push({
            category,
            questionText,
            difficultyLevel,
            options,
        });
    }
    return questions;
};


module.exports = parseFile;
