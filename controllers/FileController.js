const express = require("express");
const Users = require("../models/Users") // TO DO: put inside an object in the models file
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const pdf = require("pdf-extraction");
const fs = require('fs');

router.use(express.json());

router.get("/:id", (req, res) => {
    res.json({message: "File Controller"});
})

// Endpoint for text analysis. Sample JSON request body = {documents = ["sentence 1", "sentence 2"]}
router.post("/", upload.single("file"), (req, res) => {
    console.log(req.file);
    let databuf = fs.readFileSync(req.file.path);
    pdf(databuf).then(x => {
       console.log(x.text);
    });

    res.json({message: "File Controller"});
})


module.exports = router;