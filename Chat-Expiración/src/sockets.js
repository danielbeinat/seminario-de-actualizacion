const CryptoJS = require("crypto-js");
const userSessions = {};

function encryptMessage(message) {
  const encryptedMessage = CryptoJS.AES.encrypt(
    message,
    "secret-key"
  ).toString();
  return encryptedMessage;
}

function decryptMessage(encryptedMessage) {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, "secret-key");
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
}

module.exports = (io) => {
  let nickNames = [];

  io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("enviar mensaje", (datos) => {
      // Encriptar el mensaje antes de enviarlo
      const encryptedMessage = encryptMessage(datos);

      console.log("Mensaje encriptado:", encryptedMessage);

      io.sockets.emit("nuevo mensaje", {
        msg: encryptedMessage,
        nick: socket.nickname,
      });

      // Reiniciar el temporizador de sesión cuando se realiza una acción
      resetSessionTimer(socket);
    });

    socket.on("nuevo usuario", (datos, callback) => {
      if (nickNames.indexOf(datos) != -1) {
        callback(false);
      } else {
        callback(true);
        socket.nickname = datos;
        nickNames.push(socket.nickname);

        // Iniciar el temporizador de sesión cuando se inicia sesión
        startSessionTimer(socket);
        //Enviamos al cliente el array de usuarios:
        actualizarUsuarios();
      }
    });

    socket.on("disconnect", (datos) => {
      if (!socket.nickname) {
        return;
      } else {
        nickNames.splice(nickNames.indexOf(socket.nickname), 1);

        // Detener el temporizador de sesión cuando el usuario se desconecta
        if (userSessions[socket.nickname]) {
          clearTimeout(userSessions[socket.nickname]);
        }

        actualizarUsuarios();
      }
    });
    function startSessionTimer(socket) {
      userSessions[socket.nickname] = setTimeout(() => {
        // La sesión ha expirado
        socket.disconnect(true);
      }, 180000); // 180,000 milisegundos = 3 minutos
    }

    // reiniciar el temporizador
    function resetSessionTimer(socket) {
      if (userSessions[socket.nickname]) {
        clearTimeout(userSessions[socket.nickname]);
        startSessionTimer(socket);
      }
    }
    function actualizarUsuarios() {
      io.sockets.emit("usernames", nickNames);
    }
  });
};
