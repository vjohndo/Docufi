// Need the node postgres package for node to access the website
const pg = require("pg");

// Create an instance of a database Pool
const db = new pg.Pool({
    database: "Docufi",
});

module.exports = db;