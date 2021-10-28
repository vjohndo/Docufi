const db = require('../database/db');
const Encryption = require("./encryption");

const Users = {
    checkLogin(email, password) {
        // Will need to later implement Bcrypt
        const sql = {
            text: "SELECT * FROM users WHERE email = $1",
            values: [email]
        };
        return db.query(sql).then( (dbRes) => {
            if (!dbRes.rows[0]) {
                return false;
            }
            let result = Encryption.isValidPassword(password, dbRes.rows[0].hash);
            return result;
            
        });
    },
    signUp(email, firstname, lastname, password) {
        const hash = Encryption.generateHash(password);
        const sql = {
            text: "INSERT INTO users (email, firstname, lastname, hash) VALUES ($1, $2, $3, $4)",
            values: [email, firstname, lastname, hash]
        };
        db.query(sql, (err, res) => {
            if (err) {
                console.log(err.stack)
            }
        });
    },
    emailExists(email) {
        const sql = {
            text: "SELECT email FROM users WHERE email = $1",
            values: [email]
        };
        return db.query(sql).then( (dbRes) => dbRes.rows[0] ? true : false)
    },
    getUserByEmail(email) {
        const sql = {
            text: 'SELECT * FROM Users WHERE email = $1',
            values: [email]
        };
        return db.query(sql).then(dbRes => dbRes.rows);
    }
}

module.exports = Users;