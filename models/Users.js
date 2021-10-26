const db = require('../database/db');

const Users = {
    getById(id) {
        return db
            .query("SELECT * FROM Users where Id = $1", [id])
            .then((dbRes) => dbRes.rows);
    }
}