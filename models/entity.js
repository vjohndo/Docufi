const db = require('../database/db');

const Entity = {
    async insert(newEntity) {
        const sql = {
            text: "INSERT INTO entities (entity) VALUES ($1) RETURNING *",
            values: [newEntity]
        };
        return await db.query(sql).then(dbRes => dbRes.rows[0]);
    },
    async get(existingEntity) {
        const sql = {
            text: "SELECT * FROM entities WHERE entity = $1",
            values: [existingEntity]
        };
        return await db.query(sql).then(dbRes => dbRes.rows[0]);
    }
}

module.exports = Entity 