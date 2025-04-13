document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordInput = document.getElementById("contrasena");
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
  
    // Alternar ícono si lo deseas:
    this.textContent = type === "password" ? "👁️" : "🙈";
  });