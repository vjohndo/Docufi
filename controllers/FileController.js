const express = require("express");
const Users = require("../models/Users");
const Files = require("../models/Files");
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
router.post("/", upload.single("file"), async (req, res) => {
    console.log(req.file);
    // TODO: Get actual UserId
    const fakeUserId = 1;
    const { originalname, filename, path, size, mimetype } = req.file;
    const fileInfo = {
        'FileName' : filename,
        'OriginalName' : originalname,
        'FilePath' : path,
        'FileSize' : size,
        'FileFormat' : mimetype,
        'DateUploaded' : new Date(Date.now()).toISOString(),
        'UserId' : fakeUserId
    };

    // Write fileInfo to the db
    await Files.addFile(fileInfo);

    let dataBuf = fs.readFileSync(req.file.path);

    // TODO: Consider whether we make this call or not
    await pdf(dataBuf)
        .then(x => {
            // Return File Details to the browser
            console.log(x.text);
            res.json({
                message: "Uploaded successfully",
                fileInfo: fileInfo
            });
        })
        .catch(err => {
            console.log(err);
            res.json({message: "Upload Failed"});
        });
})


module.exports = router;