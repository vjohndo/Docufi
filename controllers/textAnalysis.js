const express = require("express");
const textAnalysis = require("../models/textAnalysis") // TO DO: put inside an object in the models file
const router = express.Router();

// Run this to able to parse through body
router.use(express.json());

// Test endpoint
router.get("/", (req, res) => {
    res.json({message: "HELLO WORLD"});
})

// Endpoint for text analysis. Sample JSON request body = {documents = ["sentence 1", "sentence 2"]}
router.post("/", (req, res) => {
    console.log("analysing text")
    const {documents} = req.body 
    textAnalysis(documents).then( (response) => {
        res.json(response);
    })
})

module.exports = router;