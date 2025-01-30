module.exports = (sequelize, DataTypes) => {
    const AnswerExplanation = sequelize.define("answerExplanation", {
        explanationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, 
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        explanationText: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    return AnswerExplanation;
};
