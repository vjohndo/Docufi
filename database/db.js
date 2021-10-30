const pg = require("pg");

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
    // If you have a password on your local db 
    // password: 'optional_password' 
  })
}

module.exports = db;