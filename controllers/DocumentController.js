const express = require("express");
const Users = require("../models/users");
const Files = require("../models/Files");
const { compareSync } = require("bcrypt");
const { query } = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
    // Currently only returns the original name and id
    Files.getFileNamesByEmail(req.session.email).then( (dbRes) => {
        res.json(dbRes);
    });
});

router.get("/search", (req, res) => {
    Files.getSearchedFiles( req.session.email, Object.values(req.query) ).then( (dbRes) => {
        res.json(dbRes);
    });
});

router.get("/:fileId", (req, res) => {
    // Still want to pass in the session email to prevent spoofing
    Files.getFileById(req.session.email, req.params.fileId).then( (dbRes) => {
        res.json(dbRes);
    });
});

module.exports = router;