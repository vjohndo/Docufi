const bcrypt = require("bcrypt");

const Encryption = {
    generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    },
    isValidPassword(plainTextPassword, passwordHash) {
        return bcrypt.compareSync(plainTextPassword, passwordHash)
    }
}

module.exports = Encryption;