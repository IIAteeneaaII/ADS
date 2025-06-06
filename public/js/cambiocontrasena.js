const form = document.getElementById("formCodigo");

if (form) {
  const validator = new JustValidate("#formCodigo");

  validator
    .addField("#nuevaContrasena", [
      {
        rule: "required",
        errorMessage: "Este campo es obligatorio",
      },
      {
        validator: (value) => {
          return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*\-_])[A-Za-z\d!@#$%^&*\-_]{8,12}$/.test(value);
        },
        errorMessage: "Debe tener entre 8 y 12 caracteres, incluir letras, números y al menos un símbolo (!@#$%^&*-_ )",
      },
    ])
    .addField("#confirmarContrasena", [
      {
        rule: "required",
        errorMessage: "Este campo es obligatorio",
      },
      {
        validator: () => {
          const pass = document.getElementById("nuevaContrasena").value;
          const confirm = document.getElementById("confirmarContrasena").value;
          return pass === confirm;
        },
        errorMessage: "Las contraseñas no coinciden",
      },
    ])
    .onSuccess(async () => {
      const contrasena = document.querySelector("#nuevaContrasena").value.trim();
      const confirmarContrasena = document.querySelector("#confirmarContrasena").value.trim();
      const email = sessionStorage.getItem("recoveryEmail");

      if (!email) {
        return Swal.fire("Error", "No se encontró el correo. Vuelve a ingresar el código.", "error");
      }

      try {
        const response = await fetch("http://localhost:3000/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            newPassword: contrasena,
            confirmPassword: confirmarContrasena,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          return Swal.fire("Error", data.message || "No se pudo cambiar la contraseña", "error");
        }

      Swal.fire({
        title: "¡Contraseña cambiada!",
        text: "Tu nueva contraseña ha sido registrada. Inicia sesión.",
        imageUrl: "/img/sharki/feliz.png",
        imageWidth: 250,
        confirmButtonText: "Aceptar",
        customClass: { confirmButton: 'btn btn-primary' },
        buttonsStyling: false
      }).then(() => {
          sessionStorage.removeItem("recoveryEmail");
          window.location.href = "/";
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
        title: "Error",
        text: "No se pudo conectar con el servidor.",
        imageUrl: "/img/sharki/lupa.png",
        imageWidth: 250,
        confirmButtonText: "Aceptar",
        customClass: { confirmButton: 'btn btn-primary' },
        buttonsStyling: false
        });
      }
    });
}

// Cancelar
document.querySelector(".btn-secondary")?.addEventListener("click", function () {
  history.back();
});

// Mostrar/Ocultar contraseña nueva
document.getElementById("togglePassword3")?.addEventListener("click", function () {
  const input = document.getElementById("nuevaContrasena");
  const type = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", type);
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
});

// Mostrar/Ocultar confirmar contraseña
document.getElementById("togglePassword4")?.addEventListener("click", function () {
  const input = document.getElementById("confirmarContrasena");
  const type = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", type);
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
});
