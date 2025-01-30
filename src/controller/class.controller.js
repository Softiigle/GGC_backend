// controller/class.controller.js
const ClassService = require('../service/class.service');
const { httpCodes } = require('../config');

class ClassController {}

// Create Class
ClassController.createClass = async (req, res, next) => {
    try {
        const classData = req.body;
        const { ownerId } = req.params;

        if (!ownerId) {
            return res.status(httpCodes.HTTP_BAD_REQUEST).json({
                status: 'error',
                message: 'Owner ID is required.',
            });
        }

        classData.coachingOwnerId = ownerId;

        const newClass = await ClassService.createClass(classData);

        return res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            message: 'Class created successfully.',
            data: newClass,
        });
    } catch (error) {
        next(error);
    }
};

// Get All Classes
ClassController.getAllClasses = async (req, res, next) => {
    try {
        const { ownerId } = req.params;

        if (!ownerId) {
            return res.status(httpCodes.HTTP_BAD_REQUEST).json({
                status: 'error',
                message: 'Owner ID is required.',
            });
        }

        const classes = await ClassService.getAllClasses(ownerId);

        return res.status(httpCodes.HTTP_OK).json({
            status: 'success',
            message: 'Classes fetched successfully.',
            data: classes,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = ClassController;
