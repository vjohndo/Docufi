const pg = require("pg");
const dotenv = require("dotenv");
dotenv.config();
// initialise the variable db:
let db;


if (process.env.NODE_ENV === 'production') {
  db = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    ssl: {
      rejectUnauthorized: false
    }
  })
} else {
  db = new pg.Pool({
    database: 'docufi',
    // If you have a password on your local db 
    // password: 'optional_password' 
  })
}

module.exports = db;