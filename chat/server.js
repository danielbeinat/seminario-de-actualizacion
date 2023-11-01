const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const CryptoJS = require("crypto-js");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + "/public")); // Asegúrate de que el directorio público sea accesible

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (message) => {
    console.log("Received message:", message);
    io.emit("message", message); // Broadcast the message to all connected clients
  });

  socket.on("encryptedMessage", (encryptedMessage) => {
    console.log("Received encrypted message:", encryptedMessage);
    const decryptedMessage = decryptMessage(encryptedMessage);
    io.emit("encryptedMessage", decryptedMessage); // Broadcast the decrypted message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Example encryption function (you can replace this with your encryption logic)
function encryptMessage(message) {
  const encryptedMessage = CryptoJS.AES.encrypt(
    message,
    "secret-key"
  ).toString();
  return encryptedMessage;
}

// Example decryption function (you can replace this with your decryption logic)
function decryptMessage(encryptedMessage) {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, "secret-key");
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
}
