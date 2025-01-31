// service/class.service.js
const db = require('../database');
const { httpCodes } = require('../config');
const errorObjGenerator = require('../middleware/errorObjGenerator');
const { Sequelize } = require('sequelize');


const Class = db.Class;
const Student = db.students;

class ClassService {}

// Create a class in the database
ClassService.createClass = async ({ className, coachingOwnerId }) => {
    try {
        if (!className || !coachingOwnerId) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, "Missing required fields.");
        }

        const newClass = await Class.create({
            className,
            coachingOwnerId,
        });

        return {
            classId: newClass.classId,
            className: newClass.className,
            coachingOwnerId: newClass.coachingOwnerId,
            message: "Class created successfully."
        };
    } catch (error) {
        console.error("Error while creating class:", error);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get all classes for a specific owner
ClassService.getAllClasses = async (coachingOwnerId) => {
    try {
        const classes = await Class.findAll({
            where: { coachingOwnerId },  
            attributes: [
                'classId', 'className', 
                [Sequelize.fn('COUNT', Sequelize.col('students.studentId')), 'totalStudents'] 
            ],
            include: [
                {
                    model: Student,
                    as: 'students',
                    attributes: [], 
                }
            ],
            group: ['Class.classId'] 
        });
        return classes;
    } catch (error) {
        console.error("Error while fetching classes:", error);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = ClassService;
