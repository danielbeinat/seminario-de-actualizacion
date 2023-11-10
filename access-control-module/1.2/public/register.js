const login = document.getElementById("login-button");

login.addEventListener("click", () => {
  window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const errorMessageElement = document.getElementById("error-message");

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
        window.alert("Registro exitoso. Ahora puedes iniciar sesión.");

        // Registro exitoso, redirigir a la página de inicio de sesión
        window.location.href = "login.html";
      } else {
        // Si la respuesta no es exitosa, mostrar el mensaje de error en el HTML
        const errorData = await response.json();
        const errorMessage = errorData.error || "Error de registro";
        console.error("Error de registro:", errorMessage);
        errorMessageElement.textContent = errorMessage;
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  });
});
