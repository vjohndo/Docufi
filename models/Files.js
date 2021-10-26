const db = require('../database/db');

const Files = {
    async addFile(file) {
        const sql = {
            text: 'INSERT INTO files (name, userid, sizebytes, type, dateuploaded) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            values: [file.name, file.userid, file.sizebytes, file.type, file.dateuploaded]
        };
        return await db.query(sql).then(dbRes => dbRes.rows);
    }
}

module.exports = Files;