module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("users", {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, 
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, 
        },
        number: {
            type: DataTypes.STRING,
            allowNull: true, 
            unique: true, 
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        numberVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        emailOtp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        emailOtpExpiryTime: {
            type: DataTypes.DATE,
            allowNull: true, 
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        registrationMethod: {
            type: DataTypes.ENUM('manual', 'google', 'facebook'),
            allowNull: false,
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('Active', 'Blocked', 'Deactivated'),
            defaultValue: 'Active',
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

    return Users;
};
