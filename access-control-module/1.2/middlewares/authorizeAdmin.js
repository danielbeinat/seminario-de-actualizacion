const mysql = require("mysql2/promise");
const { dbConfig } = require("../db/database");

function authorizeAdmin(req, res, next) {
  const { userId } = req.locals;

  if (userId === 1 || userId === 2) {
    next(); // Permite el acceso al usuario Administrador
  } else {
    return res.status(403).json({ error: "Acceso no autorizado" });
  }
}

module.exports = authorizeAdmin;
