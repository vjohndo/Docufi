// Packages required for sessions
const express = require('express');
const Users = require('../models/users');
const router = express.Router();

router.use(express.json());


router.post('/', (req, res) => {
    // Get user's name from request, look up in the database, check the password etc.
    // req.body should be {"email":"<email>", "password":"<password>"}
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

// Check login - to check on CLIENT SIDE: axios.get("/api/sessions").then((res) => console.log(res.data));
router.get("/", (req, res) => {
    if (req.session.email) {
        res.json({ email: req.session.email });
    } else {
        res.status(403).json({ message: "Not logged in" });
    }
});

// Check login - to check on CLIENT SIDE: axios.get("/api/sessions").then((res) => console.log(res.data));
router.get("/loggedIn", (req, res) => {
    if (req.session.email) {
        res.json({ isGood: true });
    } else {
        res.json({ notGood: false}); 
    }
});

// Delete login - to check on CLIENT SIDE:  axios.delete("/api/sessions").then((res) => console.log(res.data));
router.delete("/", (req, res) => {
    req.session.destroy();
    res.json({ message: "You have logged out successfully" });
});

module.exports = router;