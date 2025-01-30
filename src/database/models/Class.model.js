module.exports = (sequelize, DataTypes) => {
    const Class = sequelize.define("Class", {
      classId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      className: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coachingOwnerId: {
        type: DataTypes.INTEGER,
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
  
    return Class;
  };
  