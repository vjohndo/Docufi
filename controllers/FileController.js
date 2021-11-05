const express = require("express");
const Users = require("../models/users");
const Files = require("../models/Files");
const SearchTerms = require("../models/searchTerms");
const Entity = require("../models/entity");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const pdf = require("pdf-extraction");
const fs = require('fs');
const azureAnalyzeText = require('../models/textAnalysis');

router.use(express.json());

router.get("/", (req, res) => {
    res.json({message: "File Controller"});
})

// Get pending files
router.get("/processing",  (req, res) => {
    Files.getFilesInProcess(3).then(result => {
        res.json(result);
    })
    .catch(err => {
        res.json({message: err});
    })
})

// Endpoint for text analysis. Sample JSON request body = {documents = ["sentence 1", "sentence 2"]}
router.post("/", async (req, res) => {
    const user = await Users.getUserByEmail(req.session.email)
    // get reference to client via socketId
    const socketId = req.query["socketId"];

    const uploadedItems = [];

    // Iterate over each file
    for (let file of req.files) {
        const { originalname, filename, path, size, mimetype } = file;
        const fileInfo = {
            'FileName' : filename,
            'OriginalName' : originalname,
            'FilePath' : path,
            'FileSize' : size,
            'FileFormat' : mimetype,
            'DateUploaded' : new Date(Date.now()).toISOString(),
            'UserId' : user.id
        };

        let dataBuf = fs.readFileSync(file.path);
        const extractedData = await pdf(dataBuf);

        // Write fileInfo to the db after getting file information
        const dbResult = await Files.addFile(fileInfo);
        uploadedItems.push(fileInfo);

        // Call API / Analyse Text
        analyzeAndProcessDocuments(extractedData.text).then(async res => {
            fileInfo.TextAnalysis = res;
            fileInfo.Sentiment = res.sentiment.documents[0].sentiment;
            fileInfo.ConfidenceScores = res.sentiment.documents[0].confidenceScores;
            fileInfo.Processed = true;

            console.log(dbResult);

            // time function
            const start = new Date();

            for (entity of res.entityLinking.documents[0].entities) {
                let addedEntity = await Entity.insert(entity.name);
                if (addedEntity) {
                    await SearchTerms.connect(dbResult[0].id, addedEntity.id);
                } else {
                    let existingEntity = await Entity.get(entity.name);
                    await SearchTerms.connect(dbResult[0].id, existingEntity.id);
                }
            }

            let end = new Date() - start;
            console.info('Execution time: %dms', end);

            // Flag file in db as completed
            Files.updateFileById(fileInfo, dbResult[0].id).then(async res => {
                console.info(`File analysis complete with socketId: ${socketId}`);
                req.io.to(socketId).emit('fileAnalysisComplete', {"file": fileInfo});

                // check for additional files processing
                const processChecker = await Files.getFilesInProcess(user.id);
                if (processChecker < 1) {
                    console.info('All files completed with socket: ' + socketId);
                    // Notify client all uploads have processed
                    req.io.to(socketId).emit('allFilesAnalysed');
                }
            });
        })
    }

    // verify # uploaded files were processed
    if (uploadedItems.length == Object.values(req.files).length) {
        res.json({
            message: "Uploaded successfully",
            fileInfo: uploadedItems
        });

    } else {
        res.status(406).json();
    }
}, upload.array("files"));

async function analyzeAndProcessDocuments(text) {
    // split extracted text to conform to AzureCS requirements
    text = text.replace(/(\s+)/gm, " ");
    const textArr = text.match(/.{1,5000}/g);

    // Call AAT Service
    const rawResult = await azureAnalyzeText(textArr);

    // Output the raw result into the database
    return rawResult;
}

async function updateSearchTerms(entities) {
    for (entity of entities) {
        try {
            let addedEntity = await Entity.insert(entity.name);
            await SearchTerms.connect(addedFile[0].id, addedEntity.id);
        } 
        catch {
            let existingEntity = await Entity.get(entity.name);
            await SearchTerms.connect(addedFile[0].id, existingEntity.id);
        }
    }
}

module.exports = router;