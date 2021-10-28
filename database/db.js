const pg = require("pg");

const db = new pg.Pool({
    database: "docufi"
});

module.exports = db;