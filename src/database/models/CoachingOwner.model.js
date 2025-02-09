module.exports = (sequelize, DataTypes) => {
  const CoachingOwner = sequelize.define("coachingOwner", {
    ownerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    emailOtp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailOtpExpiry: {
      type: DataTypes.DATE, 
      allowNull: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneOtp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneOtpExpiry: {
      type: DataTypes.DATE, // Stores OTP expiration timestamp
      allowNull: true,
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coachingName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coachingStatus: {
      type: DataTypes.ENUM("pending", "active", "hold"),
      defaultValue: "pending",
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
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

  return CoachingOwner;
};
