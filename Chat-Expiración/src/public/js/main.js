let sessionTimer;
let timeLeft = 180;

function updateSessionTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("time-left").textContent =
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");
}

// Iniciar el temporizador cuando el usuario inicia sesión
function startSessionTimer() {
  clearInterval(sessionTimer);
  timeLeft = 180;
  updateSessionTimer();
  sessionTimer = setInterval(function () {
    timeLeft -= 1;
    updateSessionTimer();

    if (timeLeft === 30) {
      alert("Tu sesión está a punto de expirar. ¿Deseas extenderla?");
    }

    if (timeLeft === 0) {
      // Redireccionar al usuario cuando la sesión haya expirado
      window.location.href = "/";
    }
  }, 1000);
}

// Reiniciar el temporizador de sesión cuando se realiza una acción
function resetSessionTimer() {
  clearInterval(sessionTimer);
  startSessionTimer();
}

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

  messageForm.addEventListener("submit", function (e) {
    e.preventDefault();
    socket.emit("enviar mensaje", messageBox.value);
    messageBox.value = "";
  });

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

    // Reiniciar el temporizador de sesión cuando se recibe un mensaje
    resetSessionTimer();
  });

  nickForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Enviando...");
    socket.emit("nuevo usuario", nickName.value, function (datos) {
      if (datos) {
        nick = nickName.value;
        document.querySelector("#nick-wrap").style.display = "none";
        document.querySelector("#content-wrap").style.display = "block";
        // Iniciar el temporizador de sesión cuando el usuario inicia sesión
        startSessionTimer();
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

  const extendSessionButton = document.getElementById("extend-session");

  extendSessionButton.addEventListener("click", function () {
    resetSessionTimer();
    alert("Sesión extendida por 3 minutos.");
  });

  //array de usuarios de sockets.js
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
