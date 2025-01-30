const TestService = require('../service/Test.service')
const { httpCodes } = require('../config');

class TestController {}

TestController.createTest = async (req, res, next) => {
    try {
        const ownerId = req.params.ownerId; 
        const testData = req.body; 
        
        // Check if the file exists
        if (!req.file) {
            throw new Error('No file uploaded');
        }
        
        const filePath = req.file.path;  // This will fail if req.file is undefined

        const testPayload = {
            ...testData,
            coachingOwnerId: ownerId,
            questionFilePath: filePath 
        };


        const createdTest = await TestService.createTest(testPayload);

        return res.status(httpCodes.HTTP_OK).json({  
            success: true,
            message: "Test created successfully",
            data: createdTest
        });

    } catch (error) {
        next(error);
    }
};


module.exports = TestController;
