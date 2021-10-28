const bcrypt = require("bcrypt");

const Encryption = {
    generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    },
    isValidPassword(plainTextPassword, passwordHash) {
        return bcrypt.compareSync(plainTextPassword, passwordHash)
    }
}

// console.log(Encryption.generateHash("password"));
// console.log(Encryption.isValidPassword("password", "$2b$10$7hVAGqWiNSvVtQadwlKXmOA71GYJT0bpWFrImJQXPZpROuaZ.p5Bi"))

module.exports = Encryption;