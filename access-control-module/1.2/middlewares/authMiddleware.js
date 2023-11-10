const mysql = require("mysql2/promise");
const { dbConfig } = require("../db/database");

// Middleware para verificar la clave de sesión en todas las solicitudes

async function authenticateSession(req, res, next) {
  const sessionKey = req.headers["x-session-key"];

  if (!sessionKey) {
    return res.status(401).json({ error: "Autenticación requerida" });
  }

  const connection = await mysql.createConnection(dbConfig);

  try {
    const [rows] = await connection.execute(
      "CALL `usp-check-session-token`(?)",
      [sessionKey]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Sesión no válida" });
    }

    req.locals = {
      userId: rows[0].id,
    };

    next();
  } catch (error) {
    console.error("Error de autenticación:", error);
    res.status(500).json({ error: "Error de autenticación" });
  } finally {
    connection.end();
  }
}

module.exports = authenticateSession;
