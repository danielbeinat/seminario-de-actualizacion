const bcrypt = require("bcrypt");

// Función para generar una clave de sesión encriptada
async function generateSessionKey() {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(new Date().toISOString(), salt);
}

module.exports = {
  generateSessionKey,
};
