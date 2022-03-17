const pg = require("pg");
const dotenv = require("dotenv");
dotenv.config();
// initialise the variable db:
let db;

if (process.env.NODE_ENV === 'production') {
  db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
} else {
  db = new pg.Pool({
    database: 'docufi',
  })
}

module.exports = db;