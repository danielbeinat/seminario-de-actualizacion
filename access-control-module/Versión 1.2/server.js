const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "administrador",
  database: "access-control-component",
});

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conexión exitosa a la base de datos.");
});

app.post("/validateUser", (req, res) => {
  const { username, password } = req.body;

  const sql = "CALL validate_user(?, ?)";
  connection.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Error al validar el usuario:", err);
      res
        .status(500)
        .json({ status: "error", description: "Error de la base de datos" });
      return;
    }

    res.json({
      status: "ok",
      description: "Usuario validado satisfactoriamente",
    });
  });
});

app.post("/createUser", (req, res) => {
  const { name, password } = req.body;

  const sql = "CALL createUser(?, ?)";
  connection.query(sql, [name, password], (err, results) => {
    if (err) {
      console.error("Error al crear el usuario:", err);
      res
        .status(500)
        .json({ status: "error", description: "Error de la base de datos" });
      return;
    }

    res.json({
      status: "ok",
      description: "Usuario creado satisfactoriamente",
    });
  });
});

app.post("/createSession", (req, res) => {
  const { userId } = req.body;

  const sessionToken = generateSessionToken();
  const sql = "INSERT INTO sessions (user_id, token) VALUES (?, ?)";
  connection.query(sql, [userId, sessionToken], (err, results) => {
    if (err) {
      console.error("Error al crear la sesión:", err);
      res
        .status(500)
        .json({ status: "error", description: "Error de la base de datos" });
      return;
    }

    res.json({
      status: "ok",
      description: "Sesión de usuario creada satisfactoriamente",
      sessionToken: sessionToken,
    });
  });
});

app.post("/destroySession", (req, res) => {
  const { sessionId } = req.body;

  const sql = "DELETE FROM sessions WHERE token = ?";
  connection.query(sql, [sessionId], (err, results) => {
    if (err) {
      console.error("Error al destruir la sesión:", err);
      res
        .status(500)
        .json({ status: "error", description: "Error de la base de datos" });
      return;
    }

    res.json({
      status: "ok",
      description: "Sesión de usuario destruida satisfactoriamente",
    });
  });
});

app.post("/auditLogin", (req, res) => {
  const { userId } = req.body;

  const loginTime = new Date();
  const sql = "INSERT INTO login_audit (user_id, login_time) VALUES (?, ?)";
  connection.query(sql, [userId, loginTime], (err, results) => {
    if (err) {
      console.error("Error al auditar el login:", err);
      res
        .status(500)
        .json({ status: "error", description: "Error de la base de datos" });
      return;
    }

    res.json({
      status: "ok",
      description: "Login auditado satisfactoriamente",
    });
  });
});

app.post("/auditLogout", (req, res) => {
  const { userId } = req.body;

  const logoutTime = new Date();
  const sql = "INSERT INTO logout_audit (user_id, logout_time) VALUES (?, ?)";
  connection.query(sql, [userId, logoutTime], (err, results) => {
    if (err) {
      console.error("Error al auditar el logout:", err);
      res
        .status(500)
        .json({ status: "error", description: "Error de la base de datos" });
      return;
    }

    res.json({
      status: "ok",
      description: "Logout auditado satisfactoriamente",
    });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

function generateSessionToken() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const tokenLength = 32;
  let token = "";
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
}
