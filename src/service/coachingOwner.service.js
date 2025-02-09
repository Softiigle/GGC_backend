const db = require('../database');
const { hashPassword, comparePassword } = require('../utils/hashUtils');
const { httpCodes } = require('../config');
const errorObjGenerator = require('../middleware/errorObjGenerator');
const { generateOtp, getOtpExpiryTime } = require('../utils/otpUtils');
const emailService = require('../helper/emailService');
const CoachingOwner = db.coachingOwner;

class CoachingOwnerService {}

CoachingOwnerService.registerCoachingOwner = async ({ name, email, phone, password, coachingName, address }) => {
    // Basic validation
    if (!name || !email || !phone || !password || !coachingName) {
        throw { statusCode: httpCodes.HTTP_BAD_REQUEST, message: "All required fields must be provided." };
    }

    // Check if the email already exists
    const existingOwner = await CoachingOwner.findOne({ where: { email } });
    if (existingOwner) {
        throw { statusCode: httpCodes.HTTP_CONFLICT, message: "Email already exists." };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate OTPs
    const emailOtp = generateOtp();
    const emailOtpExpiry = getOtpExpiryTime();
    const phoneOtp = generateOtp();
    const phoneOtpExpiry = getOtpExpiryTime();

    // Create coaching owner
    const coachingOwner = await CoachingOwner.create({
        name,
        email,
        phone,
        password: hashedPassword,
        coachingName,
        address,
        emailOtp,
        emailOtpExpiry,
        phoneOtp,
        phoneOtpExpiry,
    });

     // Send OTP to email
     await emailService.sendOtpEmail(email, "Otp Verification", emailOtp);

    return {
        ownerId: coachingOwner.ownerId,
        name: coachingOwner.name,
        email: coachingOwner.email,
        coachingName: coachingOwner.coachingName,
        coachingStatus: coachingOwner.coachingStatus,
        message: "Coaching Owner registered successfully. Please verify your email and phone.",
    };
};


CoachingOwnerService.loginCoachingOwner = async ({ email, password }) => {
    try {
        if (!email || !password) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, "Email and password are required.");
        }

        const coachingOwner = await CoachingOwner.findOne({ where: { email } });

        if (!coachingOwner) {
            throw errorObjGenerator(httpCodes.HTTP_NOT_FOUND, "Invalid email or password.");
        }

        const isPasswordValid = await comparePassword(password, coachingOwner.password);
        if (!isPasswordValid) {
            throw errorObjGenerator(httpCodes.HTTP_UNAUTHORIZED, "Invalid email or password.");
        }

        // Return all necessary details
        return {
            ownerId: coachingOwner.ownerId,
            name: coachingOwner.name,
            email: coachingOwner.email,
            coachingName: coachingOwner.coachingName,
            coachingStatus: coachingOwner.coachingStatus,
            message: "Login successful.",
        };

    } catch (error) {
        console.error("Login error:", error);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, error.message || "Something went wrong.");
    }
};

CoachingOwnerService.putOtpVerification = async (ownerId, emailOtp) => {
    try {
        // 🔹 Validate input
        if (!ownerId || !emailOtp) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, "Owner ID and email OTP are required.");
        }

        // 🔹 Fetch coaching owner by ID
        const coachingOwner = await CoachingOwner.findByPk(ownerId);
        if (!coachingOwner) {
            throw errorObjGenerator(httpCodes.HTTP_NOT_FOUND, "Coaching Owner not found.");
        }

        // 🔹 Ensure OTP is correct and not expired
        const isOtpValid = coachingOwner.emailOtp === emailOtp && Date.now() <= new Date(coachingOwner.emailOtpExpiry).getTime();
        if (!isOtpValid) {
            throw errorObjGenerator(httpCodes.HTTP_BAD_REQUEST, "Invalid or expired OTP.");
        }

        // 🔹 Mark email as verified & clear OTP
        coachingOwner.emailVerified = true;
        coachingOwner.emailOtp = null;
        coachingOwner.emailOtpExpiry = null; // Remove expiry after verification

        await coachingOwner.save();

        // 🔹 Send welcome email asynchronously (Don't wait for it)
        emailService.sendWelcomeEmail(coachingOwner.email, coachingOwner.name, "OTP Verification Successful").catch((err) => {
            console.error("Error sending welcome email:", err.message);
        });

        // 🔹 Return response
        return {
            ownerId: coachingOwner.ownerId,
            name: coachingOwner.name,
            email: coachingOwner.email,
            coachingName: coachingOwner.coachingName,
            coachingStatus: coachingOwner.coachingStatus,
            message: "Email OTP verified successfully.",
        };
    } catch (error) {
        console.error("Error in OTP verification:", error.message);
        throw errorObjGenerator(error.statusCode || httpCodes.HTTP_INTERNAL_SERVER_ERROR, "Internal Server Error");
    }
};



module.exports = CoachingOwnerService;
