// Call the db module (creates an instance of db Pool)
const db = require("../database/db");

// Users model containing various methods
const Users = {
    checkLogin(reqObject) {
        const {email, password} = reqObject;
        // Will need to later implement BCrypt
        const sql = {
            text: "SELECT * FROM users WHERE Email = $1 AND Hash = $2",
            values: [email, password]
        };
        return db.query(sql).then((dbRes) => dbRes.rows[0])
    }
}

module.exports = Users;