const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Conexión a la base de datos exitosa");
    return connection;
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    throw error;
  }
}

module.exports = { connectToDatabase, dbConfig };
