const StudentService = require('../service/student.service');
const { httpCodes } = require('../config');

class StudentController {}

StudentController.createStudent = async (req, res, next) => {
    try {
        const studentData = req.body;
        const { ownerId } = req.params;

        if (!ownerId) {
            return res.status(httpCodes.HTTP_BAD_REQUEST).json({
                status: 'error',
                message: 'Owner ID is required.',
            });
        }

        studentData.coachingOwnerId = ownerId;

        const student = await StudentService.createStudent(studentData);

        return res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            message: 'Student created successfully.',
            data: student,
        });
    } catch (error) {
        next(error);
    }
};


StudentController.getStudents = async (req, res, next) => {
    try {
        const { ownerId, classId } = req.params;

        if (!ownerId) {
            return res.status(httpCodes.HTTP_BAD_REQUEST).json({
                status: 'error',
                message: 'Owner ID is required.',
            });
        }

        const students = await StudentService.getStudents(ownerId, classId);

        return res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            message: 'Students retrieved successfully.',
            data: students,
        });
    } catch (error) {
        next(error);
    }
};

StudentController.loginStudent = async (req, res, next) => {
    try {
        const { registrationId, password } = req.body;

        if (!registrationId || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Registration ID and password are required.',
            });
        }

        const student = await StudentService.authenticateStudent(registrationId, password);

        if (!student) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials.',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Login successful.',
            data: student,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = StudentController;
