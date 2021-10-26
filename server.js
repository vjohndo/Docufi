// Packages for express
const express = require("express");
const textAnalysisRouter = require("./controllers/textAnalysis");

// Load the .env and configure it. 
const dotenv = require("dotenv");
dotenv.config();

// Express server config
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('client'));

// Returns JSON
app.get("/", (req, res) => {
    res.json({message: "hello world"});
});

// router for API for text analysis
app.use("/api/textAnalysis", textAnalysisRouter);

// Start the web server
app.listen(port, () => {
    console.log(process.env.ENDPOINT)
    console.log(`listening on port http://localhost:${port}`);
});