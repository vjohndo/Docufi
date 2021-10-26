const pg = require("pg");

const db = new pg.Pool({
    database: "docufi",
    user: 'admin',
    password: 'admin'
});

module.exports = db;