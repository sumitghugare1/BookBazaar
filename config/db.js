const { Sequelize } = require('sequelize');

// Configure Sequelize with either direct connection parameters or DATABASE_URL
let sequelize;

if (process.env.DATABASE_URL) {
  // Use connection string from environment (typically for production)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // For Render, Heroku, etc.
      }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });
} else {
  // Use individual connection parameters (typically for development)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

module.exports = { sequelize };


module.exports = { sequelize };
