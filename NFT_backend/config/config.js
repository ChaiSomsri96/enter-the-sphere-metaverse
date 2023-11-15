const dotenv=require('dotenv');
module.exports = {
  "development": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "host": process.env.POSTGRES_HOST,
    "dialect": "postgresql"
  },
  "test": {
    "username": "spheretest",
    "password": "password",
    "database": "database_test",
    "host": "db_test",
		"logging": false,
    "dialect": "postgresql"
  },
  "production": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "host": process.env.POSTGRES_HOST,
    "dialect": "postgresql"
  }
}

