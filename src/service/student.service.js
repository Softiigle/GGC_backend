const db = require('../database');
const { hashPassword, comparePassword } = require('../utils/hashUtils');
const generateRegisterNumber = require('../helper/uniqueRegisterNumber');
const { httpCodes } = require('../config');
const errorObjGenerator = require('../middleware/errorObjGenerator');

const CoachingOwner = db.coachingOwner;
const Students = db.students;

class StudentService {}

StudentService.createStudent = async ({ name, classId, coachingOwnerId, password }) => {
    try {
        if (!name || !classId || !coachingOwnerId || !password) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, "Missing required fields.");
        }

        const coachingOwner = await CoachingOwner.findOne({ where: { ownerId: coachingOwnerId } });

        if (!coachingOwner) {
            throw errorObjGenerator(httpCodes.HTTP_NOT_FOUND, "Coaching Owner not found.");
        }

        const registrationId = await generateRegisterNumber(coachingOwnerId);
        const hashedPassword = await hashPassword(password);

        const student = await Students.create({
            name,
            registrationId,
            password: hashedPassword,
            classId,
            coachingOwnerId,
        });

        return {
            studentId: student.studentId,
            name: student.name,
            registrationId: student.registrationId,
            classId: student.classId,
            coachingOwnerId: student.coachingOwnerId,
            message: "Student registered successfully.",
        };
    } catch (error) {
        console.error("Error while creating student:", error);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};

StudentService.getStudents = async (ownerId, classId) => {
    try {
        const query = {
            where: { coachingOwnerId: ownerId },
        };

        if (classId) {
            query.where.classId = classId;
        }

        const students = await Students.findAll(query);

        return students;
    } catch (error) {
        console.error("Error while fetching students:", error);
        throw errorObjGenerator(httpCodes.HTTP_INTERNAL_SERVER_ERROR, "Failed to retrieve students.");
    }
};


StudentService.authenticateStudent = async (registrationId, password) => {
    try {
        const student = await Students.findOne({ where: { registrationId } });

        if (!student) {
            return null; // or throw an error if preferred
        }

        const isPasswordValid = await comparePassword(password, student.password);

        if (!isPasswordValid) {
            return null; // or throw an error if preferred
        }

        // Exclude password from the student object before returning
        const { password: _, ...studentWithoutPassword } = student.dataValues;

        return studentWithoutPassword;
    } catch (error) {
        console.error("Error while authenticating student:", error);
        throw errorObjGenerator(httpCodes.HTTP_INTERNAL_SERVER_ERROR, "Failed to authenticate student.");
    }
};

module.exports = StudentService;
