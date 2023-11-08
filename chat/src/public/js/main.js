document.addEventListener("DOMContentLoaded", function () {
  const socket = io();
  var nick = "";

  const messageForm = document.querySelector("#messages-form");
  const messageBox = document.querySelector("#message");
  const chat = document.querySelector("#chat");

  const nickForm = document.querySelector("#nick-form");
  const nickError = document.querySelector("#nick-error");
  const nickName = document.querySelector("#nick-name");

  const userNames = document.querySelector("#usernames");

  function decryptMessage(encryptedMessage) {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, "secret-key");
    const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
  }

  // Eventos

  messageForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Enviamos el evento que debe recibir el servidor
    socket.emit("enviar mensaje", messageBox.value);
    // Limpiamos el input
    messageBox.value = "";
  });

  // Evento cuando se recibe un nuevo mensaje del servidor
  socket.on("nuevo mensaje", function (datos) {
    const decryptedMessage = decryptMessage(datos.msg);
    console.log("Mensaje desencriptado:", decryptedMessage);

    let color = "#f5f4f4";
    if (nick === datos.nick) {
      color = "#9ff4c5";
    }

    const msgArea = document.createElement("div");
    msgArea.className = "msg-area mb-2";
    msgArea.style.backgroundColor = color;

    const p = document.createElement("p");
    p.className = "msg";
    p.innerHTML = `<b>${datos.nick} :</b> ${decryptedMessage}`;

    msgArea.appendChild(p);
    chat.appendChild(msgArea);
  });

  nickForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Enviando...");
    socket.emit("nuevo usuario", nickName.value, function (datos) {
      if (datos) {
        nick = nickName.value;
        document.querySelector("#nick-wrap").style.display = "none";
        document.querySelector("#content-wrap").style.display = "block";
      } else {
        nickError.innerHTML = `
                  <div class="alert alert-danger">
                  El usuario ya existe
                  </div>
                  `;
      }
      nickName.value = "";
    });
  });

  //Obtenemos el array de usuarios de sockets.js
  socket.on("usernames", function (datos) {
    let html = "";
    let color = "#000";
    let salir = "";
    console.log(nick);
    for (let i = 0; i < datos.length; i++) {
      if (nick === datos[i]) {
        color = "#027f43";
        salir = `<a class="enlace-salir" href="/"><i class="fas fa-sign-out-alt salir"></i></a>`;
      } else {
        color = "#000";
        salir = "";
      }
      html += `<p style="color:${color}"><i class="fas fa-user"></i> ${datos[i]} ${salir}</p>`;
    }

    userNames.innerHTML = html;
  });
});
