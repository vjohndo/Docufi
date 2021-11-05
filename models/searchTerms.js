const db = require('../database/db');

const searchTerms = {
    connect(filesId, entitiesID) {
        const sql = {
            text: "INSERT INTO searchterms (filesid, entitiesid) VALUES ($1, $2) ",
            values: [filesId, entitiesID]
        };
        db.query(sql, (err, res) => {
            if (err) {
                console.log(err.stack)
            }
        });
    }
}

module.exports = searchTerms