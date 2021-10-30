const pg = require("pg");
const dotenv = require("dotenv");
dotenv.config();
// initialise the variable db:
let db;

db = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
})

module.exports = db;