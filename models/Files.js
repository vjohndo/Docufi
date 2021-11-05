const db = require('../database/db');


const Files = {
    async addFile(file) {
        const sql = {
            text: 'INSERT INTO files (originalname, filename, filepath, userid, filesize, filetype, dateuploaded, textanalysis, sentiment, confidencescores) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            values: [file.OriginalName, file.FileName, file.FilePath, file.UserId, file.FileSize, file.FileFormat, file.DateUploaded, file.TextAnalysis, file.Sentiment, file.ConfidenceScores]
        };
        return await db.query(sql).then(dbRes => dbRes.rows);
    },
    async getFileNamesByEmail(email) {
        const sql = {
            text: 'SELECT files.originalname, files.id, files.sentiment, files.confidencescores FROM (files INNER JOIN users ON files.userid = users.id) WHERE users.email = $1',
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
            text: 'SELECT files.originalname, files.id, files.sentiment, files.confidencescores, entities.entity FROM files INNER JOIN searchterms ON files.id = searchterms.filesid INNER JOIN entities ON entities.id = searchterms.entitiesid INNER JOIN users ON users.email = $1',
            values: [email]
        }

        sql.text += ` WHERE UPPER(entities.entity) LIKE UPPER($2)`;
        sql.values.push('%'+searchTerms[0]+'%')

        for (let i = 1; i < searchTerms.length; i++) {
            sql.text += ` AND UPPER(entities.entity) LIKE UPPER($${i+2})`;
            sql.values.push('%'+searchTerms[i]+'%');
        }
        return await db.query(sql).then(dbRes => dbRes.rows);
    },
    async updateFileById(file, id) {
        // TODO: last modified time
        const sql = {
            text: `UPDATE files SET documentname = $1,
                        originalname = $2,
                        filename = $3, 
                        filepath = $4,
                        filesize = $5,
                        filetype = $6,
                        textanalysis = $7,
                        sentiment = $8,
                        confidencescores = $9,
                        dateuploaded = $10,
                        processed = $11
                    WHERE id = $12
                        RETURNING *`,
            values: [file.DocumentName, file.OriginalName, file.FileName, file.FilePath, file.FileSize, file.FileFormat, file.TextAnalysis, file.Sentiment, file.ConfidenceScores, file.DateUploaded, file.Processed, id]
        };
        return await db.query(sql).then(dbRes => dbRes.rows);
    },
    async getFilesInProcess(userId) {
        const sql = {
            text: `SELECT id, userid, originalname, filename, filepath, processed, dateuploaded
                    FROM files
                    WHERE processed = false and userid = $1;`,
            values: [userId]
        };
        return await db.query(sql).then(dbRes => dbRes.rows);
    }
}

module.exports = Files;