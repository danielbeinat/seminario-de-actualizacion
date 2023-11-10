document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button");

  logoutButton.addEventListener("click", async () => {
    const sessionKey = localStorage.getItem("sessionKey");

    // Enviar una solicitud de cierre de sesión al servidor
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Key": sessionKey, // Incluye la clave de sesión en las cabeceras
        },
      });

      if (response.ok) {
        // Borrar la clave de sesión almacenada
        localStorage.removeItem("sessionKey");

        window.location.href = "login.html";
      } else {
        console.error("Error al cerrar sesión:", response.status);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  });
});
