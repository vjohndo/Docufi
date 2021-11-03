const db = require('../database/db');


const Files = {
    async addFile(file) {
        console.log(file);
        const sql = {
            text: 'INSERT INTO files (originalname, filename, filepath, userid, filesize, filetype, dateuploaded, textanalysis) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            values: [file.OriginalName, file.FileName, file.FilePath, file.UserId, file.FileSize, file.FileFormat, file.DateUploaded, file.TextAnalysis]
        };
        return await db.query(sql).then(dbRes => dbRes.rows);
    },
    async getFileNamesByEmail(email) {
        const sql = {
            text: 'SELECT files.originalname, files.id FROM (files INNER JOIN users ON files.userid = users.id) WHERE users.email = $1',
            values: [email]
        };
        return await db.query(sql).then(dbRes => dbRes.rows);
    },
    async getFileById(email, fileId) {
        const sql = {
            text: 'SELECT files.textanalysis FROM (files INNER JOIN users ON files.userid = users.id) WHERE users.email = $1 AND files.id = $2',
            values: [email, fileId]
        };
        return await db.query(sql).then(dbRes => dbRes.rows[0]);
    },
    async updateFileById(file, id) {
        console.log(file);
        // TODO: last modified time
        const sql = {
            text: `UPDATE files SET documentname = $1,
                        originalname = $2,
                        filename = $3, 
                        filepath = $4,
                        filesize = $5,
                        filetype = $6,
                        textanalysis = $7, 
                        dateuploaded = $8,
                        processed = $9
                    WHERE id = $10
                        RETURNING *`,
            values: [file.DocumentName, file.OriginalName, file.FileName, file.FilePath, file.FileSize, file.FileFormat, file.TextAnalysis, file.DateUploaded, file.Processed, id]
        };
        return await db.query(sql).then(dbRes => dbRes.rows);
    },


}

module.exports = Files;