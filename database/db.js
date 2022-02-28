const pg = require("pg");
const dotenv = require("dotenv");
dotenv.config();
// initialise the variable db:
let db;

// user: process.env.DB_USER,
// password: process.env.DB_PASSWORD,
// host: process.env.DB_HOST,
//   ssl: {
//   rejectUnauthorized: false
// },

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