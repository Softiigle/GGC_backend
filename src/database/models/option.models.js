module.exports = (sequelize, DataTypes) => {
    const Option = sequelize.define("option", {
        optionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, 
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        optionText: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isCorrect: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, 
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

    return Option;
};
