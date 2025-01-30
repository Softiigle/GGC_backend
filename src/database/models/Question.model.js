module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("Question", {
      questionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questionText: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      difficultyLevel: {
        type: DataTypes.STRING,
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
    }, { timestamps: true });
  
    return Question;
  };
  