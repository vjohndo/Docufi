// Packages required for sessions
const express = require('express');
const Users = require('../models/users');
const router = express.Router();

router.use(express.json());


router.post('/', (req, res) => {
    const {email, password} = req.body;

    Users.checkLogin(email, password).then( (dbRes) => {
        if (!dbRes) {
            res.status(406).json({ message: 'Login details are not valid' })
        } else {
            req.session.email = email // Can put other things in the session too
            res.json({ message: 'SUCCESS' })
        }
    }).catch( (err) => {
        console.log(err)
        res.status(500).json({ message: 'DB NOT WORKING' })
    })
});

// Check user login status
router.get("/", (req, res) => {
    if (req.session.email) {
        res.json({ email: req.session.email });
    } else {
        res.status(403).json({ message: "Not logged in" });
    }
});

// Check user login status
router.get("/loggedIn", (req, res) => {
    if (req.session.email) {
        res.json({ isGood: true });
    } else {
        res.json({ notGood: true});

    }
});

// User logout
router.delete("/", (req, res) => {
    req.session.destroy();
    res.json({ message: "You have logged out successfully" });
});

module.exports = router;