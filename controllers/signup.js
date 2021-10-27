const express = require('express');
const Users = require('../models/users');
const router = express.Router();

router.post('/', (req, res) => {
    // Get user's name from request, look up in the database, check the password etc.
    // req.body should be {"email":"<email>", "firstname": "<fname>", "lastname": "<lastname>", password":"<password>"}
    // will have the client side ensure that two passwords are matching
    const {email, firstname, lastname, password} = req.body;

    Users.emailExists(email)
        .then( (dbRes) => {
            if (dbRes) {
                res.status(406).json({ message: 'Email already exists' })
            } else {
                req.session.email = email
                Users.signUp(email, firstname, lastname, password)
                res.json({ message: `Sign up success with ${email}` })
            }
        }).catch( (err) => {
            console.log(err)
            res.status(500).json({ message: 'DB NOT WORKING' })
        })
});

module.exports = router;