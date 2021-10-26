// Packages for express
const express = require("express");
const textAnalysisController = require("./controllers/textAnalysis");

// Load the .env and configure it. 
const dotenv = require("dotenv");
dotenv.config();

// Packages for sessions (npm install express-session connect-pg-simple)
const expressSession = require("express-session"); // Express library to handle sessions
const pgSession = require("connect-pg-simple")(expressSession); // Creates a session instance for this express session 
const sessionsController = require("./controllers/sessions");
const db = require("./database/db"); // The postgres connection we already have

// Express server config
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('client'));

// Returns JSON
app.get("/", (req, res) => {
    res.json({message: "hello world"});
});

// Session middleware & router
app.use(
    expressSession({
        store: new pgSession({ // "storing the session in DB rather than memory"
            pool: db, // Connects to our postgres db
            createTableIfMissing: true, // Creates a session table in your database 
        }),
        secret: process.env.EXPRESS_SESSION_SECRET_KEY, // Access the secret key from .env
    })
);
app.use("/api/sessions", sessionsController);

// router for API for text analysis
app.use("/api/textAnalysis", textAnalysisController);

// Start the web server
app.listen(port, () => {
    console.log(process.env.ENDPOINT)
    console.log(`listening on port http://localhost:${port}`);
});