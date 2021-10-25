// Packages for express
const express = require("express");
const textAnalysisRouter = require("./controllers/textAnalysis");

// Packages for sessions / API calls
// const dotenv = require("dotenv");

// Express server config
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('client'));

// Returns JSON
app.get("/", (req, res) => {
    res.json({message: "hello world"});
});

// API
app.use("/api/textAnalysis", textAnalysisRouter);

// Start the web server
app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
});