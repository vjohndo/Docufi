const db = require('../database/db');

const Entity = {
    add(newEntity) {
        const sql = {
            text: "INSERT INTO entities (entity) VALUES ($1)",
            values: [newEntity]
        };
        db.query(sql, (err, res) => {
            if (err) {
                console.log(err.stack)
            }
        });
    }
}

module.exports = Entity 