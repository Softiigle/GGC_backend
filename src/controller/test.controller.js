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

TestController.gettAllTestTeachrs = async (req, res, next) => {
    try {
        const ownerId = req.query.ownerId;  // Corrected to `req.params`

        if (!ownerId) {
            return res.status(httpCodes.HTTP_NOT_FOUND).json({
                success: false,
                message: "Owner ID not provided"
            });
        }

        const allTest = await TestService.getAllTestForTeacher(ownerId);

        return res.status(httpCodes.HTTP_OK).json({
            success: true,
            message: "All tests for teacher",
            data: allTest
        });

    } catch (error) {
        next(error);
    }
};

TestController.getAlltestStudent = async (req, res, next) => {
    try {
        const classId = req.query.classId; 

        if(!classId) {
            return res.status(httpCodes.HTTP_NOT_FOUND).json({
                success: false,
                message: "Class ID not provided"
            });
        }

        const allTest = await TestService.getAllTestForStudent(classId);
        
        return res.status(httpCodes.HTTP_OK).json({
            success: true,
            message: "All tests for student",
            data: allTest
        })

    } catch (error) {
        next(error);
    }
}

TestController.scheduleStudentTest = async (req, res, next) => {
    try {
        
        const testId = req.query.testId;

        if(!testId) {
            return res.status(httpCodes.HTTP_NOT_FOUND).json({
                success: false,
                message: "test ID not provided"
            });
        }

        const scheduleTestDetails = await TestService.scheduleStudentTest(testId)

        return res.status(httpCodes.HTTP_OK).json({
            success: true,
            message: "Test scheduling successful",
            data: scheduleTestDetails
        });

    } catch (error) {
        next(error);
    }
}



TestController.submitTestController = async (req, res, next) => {
    try {
        const studentId = req.query.studentId;
        const testResponseData = req.body;


        if (!studentId) {
            return res.status(httpCodes.HTTP_NOT_FOUND).json({
                success: false,
                message: "Student ID not provided",
            });
        }


        if (!testResponseData || typeof testResponseData !== "object") {
            return res.status(httpCodes.HTTP_BAD_REQUEST).json({
                success: false,
                message: "Invalid request body",
            });
        }

        const { testId, responses } = testResponseData;


        if (!testId || typeof testId !== "number") {
            return res.status(httpCodes.HTTP_BAD_REQUEST).json({
                success: false,
                message: "Invalid or missing testId",
            });
        }


        if (!Array.isArray(responses) || responses.length === 0) {
            return res.status(httpCodes.HTTP_BAD_REQUEST).json({
                success: false,
                message: "Responses must be a non-empty array",
            });
        }

        const result = await TestService.submitTestService(studentId, testResponseData);

        return res.status(httpCodes.HTTP_OK).json({
            success: true,
            message: result.message ,
        });

    } catch (error) {
        next(error);
    }
};





module.exports = TestController;
