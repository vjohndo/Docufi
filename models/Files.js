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
    async getSearchedFiles(email, searchTerms) {
        console.log("passed through the search");
        console.log(searchTerms)
        const sql = {
            text: 'SELECT files.originalname, files.id, entities.entity FROM files INNER JOIN searchterms ON files.id = searchterms.filesid INNER JOIN entities ON entities.id = searchterms.entitiesid INNER JOIN users ON users.email = $1',
            values: [email]
        }

        sql.text += ` WHERE UPPER(entities.entity) LIKE UPPER($2)`;
        sql.values.push('%'+searchTerms[0]+'%')

        for (let i = 1; i < searchTerms.length; i++) {
            sql.text += ` AND UPPER(entities.entity) LIKE UPPER($${i+2})`;
            sql.values.push('%'+searchTerms[i]+'%');
        }

        return await db.query(sql).then(dbRes => dbRes.rows);
    }
}

module.exports = Files;