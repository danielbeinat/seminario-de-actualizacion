const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const { dbConfig } = require("../db/database");
const { generateSessionKey } = require("../helpers/sessionHelpers");

async function loginHandler(req, res) {
  const { userId, password } = req.body;
  const connection = await mysql.createConnection(dbConfig);

  try {
    // Verifica las credenciales del usuario
    const [rows] = await connection.execute(
      "CALL `usp-authenticate-user`(?);",
      [userId]
    );

    console.log("Resultado de la llamada al procedimiento almacenado:", rows);

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      console.error("Usuario no encontrado o credenciales incorrectas");
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const storedUserId = rows[0][0].id;

    if (!storedUserId) {
      console.error("Usuario no encontrado en la base de datos");
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Contraseña válida, puedes generar una clave de sesión y realizar otras acciones de inicio de sesión aquí
    const sessionKey = await generateSessionKey();
    await connection.execute("CALL `usp-create-user-session`(?, ?)", [
      storedUserId,
      sessionKey,
    ]);

    // Obtén el grupo del usuario desde la base de datos
    const [groupRows] = await connection.execute(
      "SELECT group_id FROM groups_members WHERE user_id = ?",
      [storedUserId]
    );

    if (groupRows.length > 0) {
      const groupId = groupRows[0].group_id;
      res.json({ sessionKey, groupId });
    } else {
      res.json({ sessionKey });
    }
  } catch (error) {
    console.error("Error de inicio de sesión:", error);
    res.status(500).json({ error: "Error de inicio de sesión" });
  } finally {
    connection.end();
  }
}

module.exports = loginHandler;
