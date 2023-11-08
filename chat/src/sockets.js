const CryptoJS = require("crypto-js");

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

    // Al recibir un mensaje recojemos los datos
    socket.on("enviar mensaje", (datos) => {
      // Encriptar el mensaje antes de enviarlo
      const encryptedMessage = encryptMessage(datos);

      console.log("Mensaje encriptado:", encryptedMessage);

      io.sockets.emit("nuevo mensaje", {
        msg: encryptedMessage,
        nick: socket.nickname,
      });
    });

    socket.on("nuevo usuario", (datos, callback) => {
      //Nos devuelve el indice si el dato existe, es decir, si ya existe el nombre de usuario:
      if (nickNames.indexOf(datos) != -1) {
        callback(false);
      } else {
        //Si no existe le respondemos al cliente con true y agregamos el nuevo usuario:
        callback(true);
        socket.nickname = datos;
        nickNames.push(socket.nickname);
        //Enviamos al cliente el array de usuarios:
        actualizarUsuarios();
      }
    });

    socket.on("disconnect", (datos) => {
      //Si un usuario se desconecta lo eliminamos del array
      if (!socket.nickname) {
        return;
      } else {
        nickNames.splice(nickNames.indexOf(socket.nickname), 1);

        actualizarUsuarios();
      }
    });

    function actualizarUsuarios() {
      io.sockets.emit("usernames", nickNames);
    }
  });
};
