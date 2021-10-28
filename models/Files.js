const db = require('../database/db');

const Files = {
    async addFile(file) {
        console.log(file);
        const sql = {
            text: 'INSERT INTO files (originalname, filename, filepath, userid, filesize, filetype, dateuploaded) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            values: [file.OriginalName, file.FileName, file.FilePath, file.UserId, file.FileSize, file.FileFormat, file.DateUploaded]
        };
        return await db.query(sql).then(dbRes => dbRes.rows);
    }
}

module.exports = Files;