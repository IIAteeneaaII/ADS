document.getElementById("togglePassword2").addEventListener("click", function () {
    const passwordInput = document.getElementById("elim_contrasena");
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    this.textContent = type === "password" ? "👁️" : "🙈";
  });