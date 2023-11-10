const mysql = require("mysql2/promise");
const { dbConfig } = require("../db/database");

async function logoutHandler(req, res) {
  const sessionKey = req.headers["x-session-key"];

  if (!sessionKey) {
    return res.status(401).json({ error: "Autenticación requerida" });
  }

  const userId = req.locals.userId;

  const connection = await mysql.createConnection(dbConfig);

  try {
    if (sessionKey !== undefined) {
      await connection.execute("CALL `usp-delete-user-session`(?)", [
        sessionKey,
      ]);
      res.json({ message: "Sesión cerrada exitosamente" });
    } else {
      console.error("El token de sesión es undefined");
      res.status(500).json({ error: "Error al cerrar sesión" });
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).json({ error: "Error al cerrar sesión" });
  } finally {
    connection.end();
  }
}

module.exports = logoutHandler;
