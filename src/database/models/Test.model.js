module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define("Test", {
      testId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      testName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coachingOwnerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      testTime: {  
        type: DataTypes.TIME,
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
  
    return Test;
  };
  