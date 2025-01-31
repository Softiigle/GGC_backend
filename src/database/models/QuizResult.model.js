module.exports = (sequelize, DataTypes) => {
    const QuizResult = sequelize.define("QuizResult", {
      resultId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalQuestions: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      correctAnswers: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      published: { 
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
    }, { timestamps: true });
  
    return QuizResult;
  };
  