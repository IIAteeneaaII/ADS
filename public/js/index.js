document.getElementById("togglePassword").addEventListener("click", function () {
  const passwordInput = document.getElementById("contrasena");
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;

  this.textContent = type === "password" ? "👁️" : "🙈";
});

document.getElementById("formLogin").addEventListener("submit", function (event) {
  event.preventDefault(); // Evita que se recargue la página

  const email = document.getElementById("boleta").value;
  const password = document.getElementById("contrasena").value;

  // Validación opcional (puedes quitar esto si ya usas required)
  if (email && password) {
      // Aquí podrías hacer la petición a backend si aplica

      Swal.fire({
          icon: 'success',
          title: 'Sesión iniciada',
          text: 'Se ha accedido correctamente.',
          confirmButtonText: 'Aceptar',
          customClass: {
              confirmButton: 'btn btn-primary'
          }
      }).then(()=>{
        window.location.href = "preferencias.html"; // volver al login
      });
  } else {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor completa todos los campos.',
          confirmButtonText: 'Aceptar'
      });
  }
});
