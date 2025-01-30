module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("question", {
        questionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, 
        },
        category: {
            type: DataTypes.STRING(500),  // Define a larger string size (500)
            allowNull: false,
        },
        questionText: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        difficultyLevel: {
            type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
            defaultValue: 'Medium',
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

    return Question;
};
