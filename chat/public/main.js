const socket = io(); // Socket.io instance

const messages = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const messageForm = document.getElementById("message-form");

// Listen for messages from the server
socket.on("message", (message) => {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(message));
  messages.appendChild(li);
});

// Send a message to the server when the form is submitted
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  socket.emit("message", message);
  messageInput.value = "";
});

// Example encryption function (you can replace this with your encryption logic)
function encryptMessage(message) {
  // This is a simple example using CryptoJS AES encryption
  const encryptedMessage = CryptoJS.AES.encrypt(
    message,
    "secret-key"
  ).toString();
  return encryptedMessage;
}

// Example decryption function (you can replace this with your decryption logic)
function decryptMessage(encryptedMessage) {
  // This is a simple example using CryptoJS AES decryption
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, "secret-key");
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
}

// Listen for incoming encrypted messages from the server
socket.on("encryptedMessage", (encryptedMessage) => {
  const decryptedMessage = decryptMessage(encryptedMessage);
  const li = document.createElement("li");
  li.appendChild(document.createTextNode("Decrypted: " + decryptedMessage));

  messages.appendChild(li);
});

// Encrypt and send a message to the server
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const encryptedMessage = encryptMessage(message);
  socket.emit("encryptedMessage", encryptedMessage);
  messageInput.value = "";
});
