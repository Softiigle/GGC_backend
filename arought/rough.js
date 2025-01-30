const CONFIG = require('../config/dbConfig'); 
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  CONFIG.SQL_CONFIG.database, 
  CONFIG.SQL_CONFIG.username, 
  CONFIG.SQL_CONFIG.password, {
    host: CONFIG.SQL_CONFIG.host,
    port: CONFIG.SQL_CONFIG.port,
    dialect: CONFIG.SQL_CONFIG.dialect,
    logging: false 
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.coachingOwner = require("./models/CoachingOwner.model")(sequelize, Sequelize);
db.students = require("./models/Student.model")(sequelize, Sequelize);
db.Class = require("./models/Class.model")(sequelize, Sequelize); // Add the Class model

// Associations
db.coachingOwner.hasMany(db.students, { foreignKey: 'coachingOwnerId', as: 'students', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.students.belongsTo(db.coachingOwner, { foreignKey: 'coachingOwnerId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

db.coachingOwner.hasMany(db.Class, { foreignKey: 'coachingOwnerId', as: 'classes', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.Class.belongsTo(db.coachingOwner, { foreignKey: 'coachingOwnerId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

db.Class.hasMany(db.students, { foreignKey: 'classId', as: 'students', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.students.belongsTo(db.Class, { foreignKey: 'classId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = db;
