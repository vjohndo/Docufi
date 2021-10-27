// Call the db module (creates an instance of db Pool)
const db = require("../database/db");
const Encryption = require("./encryption")



// Users model containing various methods
const Users = {
    checkLogin(email, password) {
        // Will need to later implement Bcrypt
        const sql = {
            text: "SELECT * FROM users WHERE Email = $1",
            values: [email]
        };
        return db.query(sql).then( (dbRes) => {
            if (!dbRes.rows[0]) {
                return false;
            }
            console.log(password, dbRes.rows[0].hash);
            let result = Encryption.isValidPassword(password, dbRes.rows[0].hash);
            return result;
            
        });
    }
}

module.exports = Users;