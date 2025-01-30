const db = require('../database');
const CoachingOwner = db.coachingOwner;
const Students = db.students;

const generateRegisterNumber = async (coachingOwnerId) => {
    try {
        const coachingOwner = await CoachingOwner.findOne({ where: { ownerId: coachingOwnerId } });
        if (!coachingOwner) {
            throw new Error('Coaching owner not found');
        }

        const coachingName = coachingOwner.coachingName;
        const abbreviation = coachingName.split(' ').map(word => word[0].toUpperCase()).join('').substring(0, 3);

        const lastStudent = await Students.findOne({
            where: { coachingOwnerId },
            order: [['createdAt', 'DESC']],
        });

        let nextNumber = 1;
        if (lastStudent && lastStudent.registrationId) {
            const lastNumber = parseInt(lastStudent.registrationId.replace(/\D/g, ''), 10);
            nextNumber = lastNumber + 1;
        }

        const formattedNumber = abbreviation + String(nextNumber).padStart(10 - abbreviation.length, '0');
        return formattedNumber;
    } catch (error) {
        throw error;
    }
};

module.exports = generateRegisterNumber;
