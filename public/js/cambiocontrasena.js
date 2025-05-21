const form = document.getElementById("formCodigo");

if (form) {
  const validator = new JustValidate("#formCodigo", {
    errorFieldCssClass: "is-invalid",
    errorLabelStyle: {
      color: "#dc3545",
      fontSize: "0.875em",
    },
  });

  validator
    .addField("#nuevaContrasena", [
      {
        rule: "required",
        errorMessage: "Este campo es obligatorio",
      },
      {
        rule: "password",
        errorMessage: "Debe tener al menos 8 caracteres e incluir letras, números y un símbolo",
      },
      {
        validator: (value) => {
          return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s])[^\s]{8,}$/.test(value);
        },
        errorMessage: "Formato inválido: usa letras, números y un símbolo (!$@%)",
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
          icon: "success",
          title: "Contraseña cambiada",
          text: "Tu nueva contraseña ha sido registrada.",
          confirmButtonText: "Iniciar sesión",
          customClass: { confirmButton: "btn-primary" },
        }).then(() => {
          sessionStorage.removeItem("recoveryEmail");
          window.location.href = "/";
        });
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo conectar con el servidor", "error");
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
