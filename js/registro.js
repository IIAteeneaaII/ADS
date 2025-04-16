// Mostrar/ocultar contraseña principal
document.getElementById("togglePassword1").addEventListener("click", function () {
    const input = document.getElementById("contrasena");
    input.type = input.type === "password" ? "text" : "password";
    this.textContent = input.type === "password" ? "👁️" : "🙈";
  });
  
  // Mostrar/ocultar confirmar contraseña
  document.getElementById("togglePassword2").addEventListener("click", function () {
    const input = document.getElementById("confirmarContrasena");
    input.type = input.type === "password" ? "text" : "password";
    this.textContent = input.type === "password" ? "👁️" : "🙈";
  });
  
  // Validación de contraseñas coincidentes
  document.getElementById("formRegistro").addEventListener("submit", function (e) {
    const pass1 = document.getElementById("contrasena");
    const pass2 = document.getElementById("confirmarContrasena");
  
    // Limpiar errores previos
    pass1.classList.remove("is-invalid");
    pass2.classList.remove("is-invalid");
    const errorMsg = document.getElementById("errorPassword");
    if (errorMsg) errorMsg.remove();
  
    // Comparar contraseñas
    if (pass1.value !== pass2.value) {
      e.preventDefault(); // Detener envío
      pass1.classList.add("is-invalid");
      pass2.classList.add("is-invalid");
  
      const error = document.createElement("div");
      error.id = "errorPassword";
      error.className = "text-danger mt-1";
      error.textContent = "Las contraseñas no coinciden.";
      pass2.parentElement.appendChild(error);
    }
  });
  document.querySelector(".btn-secondary").addEventListener("click", function () {
    history.back();
  });

  document.getElementById("formRegistro").addEventListener("submit", function (event) {
    event.preventDefault();
    
    //Alertas en caso de que las quisieramos cambiar los errores

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const confirmarContrasena = document.getElementById("confirmarContrasena").value;
    const terminosCheck = document.getElementById("terminosCheck").checked;

   
    if (nombre === "" || correo === "" || contrasena === "" || confirmarContrasena === "") {
        Swal.fire({
            icon: "warning",
            title: "Campos vacíos",
            text: "Por favor completa todos los campos.",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: 'btn-secondary',
            },
            buttonsStyling: false // ¡Importante para usar tus propias clases!
        });
        return;
    }

    if (contrasena !== confirmarContrasena) {
        Swal.fire({
            icon: "error",
            title: "Error de contraseña",
            text: "Las contraseñas no coinciden.",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: 'btn-secondary',
            },
            buttonsStyling: false // ¡Importante para usar tus propias clases!
        });
        return;
    }

    if (!terminosCheck) {
        Swal.fire({
            icon: "info",
            title: "Términos no aceptados",
            text: "Debes aceptar los términos y condiciones.",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: 'btn-secondary',
            },
            buttonsStyling: false // ¡Importante para usar tus propias clases!
        });
        return;
    }


    // Aqui iria la lógica de registro real

    // Mostramos alerta de éxito
    Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu cuenta ha sido creada correctamente.",
        confirmButtonText: "Aceptar",
        customClass: {
            confirmButton: 'btn-secondary',
        },
          buttonsStyling: false // ¡Importante para usar tus propias clases!
    }).then(() => {
        // Redirigir o limpiar el formulario si se desea
        window.location.href = "index.html"; // o donde quieras redirigir
    });
});
