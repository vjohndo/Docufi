// Packages for express
const express = require("express");

// Packages for sessions / API calls
// const dotenv = require("dotenv");

// Express server config
const app = express();
const port = 3000;

// Any of these routes will get thrown into the rulesRouter
app.get("/", (req, res) => {
    res.json({message: "hello world"});
});

// Start the web server
app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});