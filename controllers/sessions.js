// Packages required for sessions
const express = require('express');
const Users = require('../models/users');
const router = express.Router();
router.use(express.json());


router.post('/', (req, res) => {
    // Get user's name from request, look up in the database, check the password etc.
    // req.body should be {"email":"<email>", "password":"<password>"}
    Users.checkLogin(req.body).then( (dbRes) => {
        if (!dbRes) {
            res.status(406).json({ message: 'login details not on file' })
        } else {
            console.log(dbRes);
            const email = dbRes.email 
            req.session.email = email // Can put other things in the session too
            res.json({ message: 'SUCCESS' })
        }
    }).catch( (err) => {
        res.status(500).json({ message: 'DB NOT WORKING' })
    })
});

// Check login - on CLIENT SIDE: axios.get("/api/sessions").then((res) => console.log(res.data));
router.get("/", (req, res) => {
    if (req.session.username) {
        res.json({ username: req.session.username });
    } else {
        res.status(403).json({ message: "Not logged in" });
    }
});

// Delete login - on CLIENT SIDE: - on CLIENT SIDE: axios.get("/api/sessions").then((res) => console.log(res.data));
router.delete("/", (req, res) => {
    req.session.destroy();
    res.json({ message: "You have logged out successfully" });
});

module.exports = router;