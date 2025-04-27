document.getElementById("togglePassword").addEventListener("click", function () {
  const passwordInput = document.getElementById("contrasena");
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  this.textContent = type === "password" ? "👁️" : "🙈";
});