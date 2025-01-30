const { uploadQuestionsFromFile } = require('../service/question.Service');

const uploadQuestions = async (req, res) => {
    try {
        // Check if the file is present
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        // Get the file path from Multer
        const filePath = req.file.path;

        // Process the uploaded file and upload the questions
        const result = await uploadQuestionsFromFile(filePath);

        // Send success message as JSON response
        res.json(result);
    } catch (err) {
        // Handle any errors and send error response
        console.error('Error occurred while uploading questions:', err.message);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    uploadQuestions,
};
