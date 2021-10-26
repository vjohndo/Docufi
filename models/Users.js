const db = require('../database/db');

const Users = {
    async getUserByEmail(email) {
        const sql = {
            text: 'SELECT * FROM Users WHERE email = $1',
            values: [email]
        };
        return await db.query(sql).then(dbRes => dbRes.rows);
    }
}

module.exports = Users;