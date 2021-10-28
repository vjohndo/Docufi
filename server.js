// Packages for express
const express = require("express");
const textAnalysisRouter = require("./controllers/textAnalysis");
const fileRouter = require("./controllers/FileController");

// Load the .env and configure it. 
const dotenv = require("dotenv");
dotenv.config();

// Express server config
const app = express();
const port = 3000;

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.static('client'));

// Returns JSON
app.get("/", (req, res) => {
    res.json({message: "hello world"});
});

// router for API for text analysis
app.use("/api/textAnalysis", textAnalysisRouter);
app.use("/api/file", fileRouter);

// Start the web server
app.listen(port, () => {
    console.log(process.env.ENDPOINT)
    console.log(`listening on port http://localhost:${port}`);
});