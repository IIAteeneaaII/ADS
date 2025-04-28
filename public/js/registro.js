document.getElementById("formRegistro").addEventListener("submit", async function (event) {
  event.preventDefault();

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
      customClass: { confirmButton: 'btn-secondary' },
      buttonsStyling: false
    });
    return;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(contrasena)) {
    Swal.fire({
      icon: "error",
      title: "Contraseña inválida",
      text: "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.",
      confirmButtonText: "OK",
      customClass: { confirmButton: 'btn-secondary' },
      buttonsStyling: false
    });
    return;
  }

  if (contrasena !== confirmarContrasena) {
    Swal.fire({
      icon: "error",
      title: "Error de contraseña",
      text: "Las contraseñas no coinciden.",
      confirmButtonText: "OK",
      customClass: { confirmButton: 'btn-secondary' },
      buttonsStyling: false
    });
    return;
  }

  if (!terminosCheck) {
    Swal.fire({
      icon: "info",
      title: "Términos no aceptados",
      text: "Debes aceptar los términos y condiciones.",
      confirmButtonText: "OK",
      customClass: { confirmButton: 'btn-secondary' },
      buttonsStyling: false
    });
    return;
  }

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: nombre,
        email: correo,
        password: contrasena
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.msg || "Error en el registro");
    }

    Swal.fire({
      icon: "success",
      title: "¡Registro exitoso!",
      text: "Tu cuenta ha sido creada correctamente.",
      confirmButtonText: "Aceptar",
      customClass: { confirmButton: 'btn-secondary' },
      buttonsStyling: false
    }).then(() => {
      window.location.href = "/"; 
    });

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
      confirmButtonText: "OK",
      customClass: { confirmButton: 'btn-secondary' },
      buttonsStyling: false
    });
  }
});
