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
const { PiiEntityDomain } = require("@azure/ai-text-analytics");

router.use(express.json());

router.get("/:id", (req, res) => {
    res.json({message: "File Controller"});
})

// Endpoint for text analysis. Sample JSON request body = {documents = ["sentence 1", "sentence 2"]}
router.post("/", upload.array("files"), async (req, res) => {
    const user = await Users.getUserByEmail(req.session.email)
    const uploadedItems = [];

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
        const result = await analyzeAndProcessDocuments(extractedData.text);

        fileInfo["TextAnalysis"] = result;
        fileInfo["Sentiment"] = result.sentiment.documents[0].sentiment;
        fileInfo["ConfidenceScores"] = result.sentiment.documents[0].confidenceScores;

        const addedFile = await Files.addFile(fileInfo);

        // Write fileInfo to the db after getting the results
        for (entity of result.entityLinking.documents[0].entities) {
            try {
                let addedEntity = await Entity.insert(entity.name);
                await SearchTerms.connect(addedFile[0].id, addedEntity.id);
            } 
            catch {
                let addedEntity = await Entity.get(entity.name);
                await SearchTerms.connect(addedFile[0].id, addedEntity.id);
            }
        }

        uploadedItems.push(fileInfo);
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
});

// Need to look into this function!!!
async function analyzeAndProcessDocuments(text) {
    console.log("File recieved");
    // split extracted text to conform to AzureCS requirements
    text = text.replace(/(\s+)/gm, " ");
    const textArr = text.match(/.{1,5000}/g);

    // Call AAT Service
    console.log("Analysing Text");
    const rawResult = await azureAnalyzeText(textArr);

    console.log("Returning Results Text");
    // Output the raw result into the database
    return rawResult;
}

function dataSanatizing() {
                // Get and remove erroneous datasets
        const errors = [];
        for (const item in rawResult) {
            const collectionObject = rawResult[item];
            collectionObject.documents.forEach(obj => {
            if (obj.error) {
                errors.push(obj.error);
                rawResult[item].error = true;
                console.log(`Error in analysis: ${JSON.stringify(obj.error)}`)
            }
            });
        }

        // only take data with no errors 
        const sanitizedData = Object.entries(rawResult).filter(x => !x[1].error).map(x => {
            return { [x[0]] : [x[1]]  }
        })
        console.log('SANATIZED DATA:', sanitizedData);
        console.log('SANATIZED DATA:', sanitizedData[0]);
        console.log('SANATIZED DATA:', sanitizedData[0].sentiment);
    
        // Return if no data found
        if (sanitizedData.length < 1) {
            return {
                'success': false,
                'message': errors
            }
        }
    
        if (!sanitizedData) {
            console.log('No documents');
            return {
                'success': false,
                'message': 'No documents found in file'
            }
        }
    
        return {
            'success': true,
            'message': 'Documents analyzed successfully'
        }
}

module.exports = router;