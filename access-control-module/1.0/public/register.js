const login = document.getElementById("login-button");

login.addEventListener("click", () => {
  window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("Name").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        // Registro exitoso, redirigir a la página de inicio de sesión
        window.location.href = "login.html";
      } else {
        console.error("Error de registro:", response.status);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  });
});
