const db = require('../database');
const { hashPassword, comparePassword } = require('../utils/hashUtils');
const { httpCodes } = require('../config');
const errorObjGenerator = require('../middleware/errorObjGenerator');
const { CoachingOwner } = db;

class CoachingOwnerService {}

CoachingOwnerService.registerCoachingOwner = async ({ name, email, phone, password, coachingName, address }) => {
    try {
        if (!name || !email || !phone || !password || !coachingName) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, "Missing required fields.");
        }

        // Check if the email is already taken
        const existingOwner = await CoachingOwner.findOne({ where: { email } });
        if (existingOwner) {
            throw errorObjGenerator(httpCodes.HTTP_CONFLICT, "Email already exists.");
        }

        const hashedPassword = await hashPassword(password);

        const coachingOwner = await CoachingOwner.create({
            name,
            email,
            phone,
            password: hashedPassword,
            coachingName,
            address,
        });

        return {
            ownerId: coachingOwner.ownerId,
            name: coachingOwner.name,
            email: coachingOwner.email,
            coachingName: coachingOwner.coachingName,
            message: "Coaching Owner registered successfully.",
        };
    } catch (error) {
        console.error("Error while registering coaching owner:", error);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};

CoachingOwnerService.loginCoachingOwner = async ({ email, password }) => {
    try {
        if (!email || !password) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, "Email and password are required.");
        }

        const coachingOwner = await CoachingOwner.findOne({ where: { email } });
        if (!coachingOwner) {
            throw errorObjGenerator(httpCodes.HTTP_NOT_FOUND, "Coaching Owner not found.");
        }

        const isPasswordValid = await comparePassword(password, coachingOwner.password);
        if (!isPasswordValid) {
            throw errorObjGenerator(httpCodes.HTTP_UNAUTHORIZED, "Invalid credentials.");
        }

        return {
            ownerId: coachingOwner.ownerId,
            name: coachingOwner.name,
            email: coachingOwner.email,
            coachingName: coachingOwner.coachingName,
            message: "Login successful.",
        };
    } catch (error) {
        console.error("Error while logging in coaching owner:", error);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = CoachingOwnerService;
