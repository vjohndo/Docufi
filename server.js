// Packages for express
const express = require("express");
const fileController = require("./controllers/FileController");
const documentController = require("./controllers/DocumentController")

// Load the .env and configure it. 
const dotenv = require("dotenv");
dotenv.config();

// Packages for logins, sessions (npm install express-session connect-pg-simple)
const expressSession = require("express-session"); // Express library to handle sessions
const pgSession = require("connect-pg-simple")(expressSession); // Creates a session instance for this express session 
const sessionsController = require("./controllers/sessions");
const signupController = require("./controllers/signup")
const db = require("./database/db"); // The postgres connection we already have
const errorHandler = require('./middleware/errorhandler');

// Express server config
const app = express();
const port = process.env.PORT || 3000;

// SocketIo
const { createServer } = require("http");
const socketIo = require("socket.io");
const server = createServer(app)
const io = socketIo(server, { cors: { origin: "*" } });

// pass socket io instance via middleware
app.use((req, res, next) => {
    req.io = io;
    return next();
});
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
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

app.use("/api/documents", documentController);
app.use("/api/sessions", sessionsController);
app.use("/api/signup", signupController);

app.use((req, res, next) => {
    // sessions are being set as "email";
    if (!req.session.email) {
        res.status(401).send();
    } else {
        next();
    }
});

// router for API for text analysis
app.use("/api/file", fileController);

app.use(errorHandler);

// Start the web server
server.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
});
