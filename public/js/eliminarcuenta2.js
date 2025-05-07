document.getElementById("togglePassword").addEventListener("click", function () {
  const passwordInput = document.getElementById("contrasena");
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  this.textContent = type === "password" ? "👁️" : "🙈";
});

// Función para obtener una cookie por nombre
function getCookie(name) {


  console.log("Todas las cookies:", document.cookie);
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

// Función para decodificar el payload del JWT
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`;
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error al decodificar el token:", e);
    return null;
  }
}

// Evento para el botón "Eliminar cuenta"
document.getElementById("btnEliminar").addEventListener("click", async () => {
  const password = document.getElementById("contrasena").value;

  if (!password) {
    alert("Por favor, ingresa tu contraseña.");
    return;
  }

  const jwt = getCookie("token");
  if (!jwt) {
    alert("No se encontró el token de autenticación.");
    return;
  }

  const payload = parseJwt(jwt);
  const email = payload?.email;

  if (!email) {
    alert("No se pudo extraer el correo del token.");
    return;
  }

  try {
    const response = await fetch("/api/auth/deleteAcc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      alert("Cuenta eliminada correctamente.");
      window.location.href = "/"; // Redirige al login
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || "No se pudo eliminar la cuenta."}`);
    }
  } catch (err) {
    console.error("Error al hacer la solicitud:", err);
    alert("Ocurrió un error inesperado.");
  }
});
