const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mysql = require("mysql2/promise");

const { connectToDatabase, dbConfig } = require("./db/database");
const authenticateSession = require("./middlewares/authMiddleware");
const authorizeAdmin = require("./middlewares/authorizeAdmin");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

const registerHandler = require("./handlers/registerHandler");
app.post("/register", registerHandler);
const loginHandler = require("./handlers/loginHandler");
app.post("/login", loginHandler);

const logoutHandler = require("./handlers/logoutHandler");
app.post("/logout", authenticateSession, logoutHandler);

app.get(
  "/admin-dashboard.html",
  authenticateSession,
  authorizeAdmin,
  (req, res) => {
    res.sendFile(__dirname + "./public/admin-dashboard.html");
  }
);

async function startServer() {
  const dbConnection = await connectToDatabase();

  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
}

startServer();
