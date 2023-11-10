const register = document.getElementById("register-button");

register.addEventListener("click", () => {
  window.location.href = "register.html";
});

document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("login-form");
  const errorMessageElement = document.getElementById("error-message");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Enviar los datos de inicio de sesión al servidor usando Fetch
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const sessionKey = data.sessionKey;
        console.log("Respuesta del servidor:", data);

        // Almacenar la clave de sesión en localStorage
        localStorage.setItem("sessionKey", sessionKey);

        // Redirigir al usuario al dashboard de acuerdo con su grupo
        if (data.groupId === 1) {
          window.location.href = "/admin-dashboard.html";
        } else {
          window.location.href = "dashboard.html";
        }
      } else {
        // Si la respuesta no es exitosa, mostrar el mensaje de error en el HTML
        const errorData = await response.json();
        const errorMessage = errorData.error || "Credenciales inválidas";

        console.error("Error de inicio de sesión:", errorMessage);
        errorMessageElement.textContent = errorMessage;
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  });
});
