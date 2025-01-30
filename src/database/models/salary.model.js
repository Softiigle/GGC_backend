module.exports = (sequelize, DataTypes) => {
    const Salary = sequelize.define("salary", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Required field for employee reference
      },
      month: {
        type: DataTypes.DATEONLY,
        allowNull: false, // Month for salary calculation
      },
      basicSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Required field
      },
      deductions: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00, // Default deduction is zero
      },
      totalSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Total salary after deductions
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
  
    return Salary;
  };
  