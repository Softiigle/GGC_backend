require('dotenv').config();


module.exports = {
  SQL_CONFIG: {
    username: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    dialect: process.env.SQL_DIALECT.replace(/'/g, '')
  }
};
