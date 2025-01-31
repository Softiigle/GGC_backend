const CONFIG = require('../config/dbConfig');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  CONFIG.SQL_CONFIG.database,
  CONFIG.SQL_CONFIG.username,
  CONFIG.SQL_CONFIG.password,
  {
    host: CONFIG.SQL_CONFIG.host,
    port: CONFIG.SQL_CONFIG.port,
    dialect: CONFIG.SQL_CONFIG.dialect,
    logging: false
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.coachingOwner = require("./models/CoachingOwner.model")(sequelize, Sequelize);
db.students = require("./models/Student.model")(sequelize, Sequelize);
db.Class = require("./models/Class.model")(sequelize, Sequelize);

db.Test = require('./models/Test.model')(sequelize, Sequelize);
db.Question = require('./models/Question.model')(sequelize, Sequelize);
db.Option = require('./models/Option.model')(sequelize, Sequelize);
db.StudentResponse = require('./models/StudentResponse.model')(sequelize, Sequelize);
db.QuizResult = require('./models/QuizResult.model')(sequelize, Sequelize);

// Associations
db.coachingOwner.hasMany(db.students, { foreignKey: 'coachingOwnerId', as: 'students', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.students.belongsTo(db.coachingOwner, { foreignKey: 'coachingOwnerId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

db.coachingOwner.hasMany(db.Class, { foreignKey: 'coachingOwnerId', as: 'classes', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.Class.belongsTo(db.coachingOwner, { foreignKey: 'coachingOwnerId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

db.Class.hasMany(db.students, { foreignKey: 'classId', as: 'students', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.students.belongsTo(db.Class, { foreignKey: 'classId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

db.Test.hasMany(db.Question, { foreignKey: 'testId', as: 'questions', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.Question.belongsTo(db.Test, { foreignKey: 'testId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

db.Question.hasMany(db.Option, { foreignKey: 'questionId', as: 'options', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.Option.belongsTo(db.Question, { foreignKey: 'questionId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

db.coachingOwner.hasMany(db.Test, { foreignKey: 'coachingOwnerId', as: 'tests', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.Test.belongsTo(db.coachingOwner, { foreignKey: 'coachingOwnerId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

db.Class.hasMany(db.Test, { foreignKey: 'classId', as: 'tests', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.Test.belongsTo(db.Class, { foreignKey: 'classId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Associations for new models
// Ensure a student can only submit one response per test
db.students.hasOne(db.StudentResponse, { foreignKey: 'studentId', as: 'response', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.StudentResponse.belongsTo(db.students, { foreignKey: 'studentId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

db.Test.hasOne(db.StudentResponse, { foreignKey: 'testId', as: 'response', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.StudentResponse.belongsTo(db.Test, { foreignKey: 'testId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

db.students.hasMany(db.QuizResult, { foreignKey: 'studentId', as: 'results', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.QuizResult.belongsTo(db.students, { foreignKey: 'studentId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

db.Test.hasMany(db.QuizResult, { foreignKey: 'testId', as: 'results', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.QuizResult.belongsTo(db.Test, { foreignKey: 'testId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });


module.exports = db;
