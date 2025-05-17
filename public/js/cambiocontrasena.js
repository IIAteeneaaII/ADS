document.getElementById("formCodigo").addEventListener("submit", function (event) {
    event.preventDefault();

    const contrasena = document.getElementById("nuevaContrasena").value;
    const confirmarContrasena = document.getElementById("confirmarContrasena").value;


  if (contrasena === "" || confirmarContrasena === "") {
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


    // Mostrar éxito
    Swal.fire({
        icon: "success",
        title: "Contraseña cambiada",
        text: "Tu nueva contraseña ha sido registrada. Inicia sesión.",
        customClass: {
            confirmButton: 'btn-primary'
        },
        confirmButtonText: "Aceptar"
    }).then(() => {
        window.location.href = "index.html"; // volver al login
    });
});

document.querySelector(".btn-secondary").addEventListener("click", function () {
    history.back();
});

// Mostrar/Ocultar contraseña nueva
document.getElementById("togglePassword3").addEventListener("click", function () {
    const input = document.getElementById("nuevaContrasena");
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
    // Cambia la imagen del ícono
    //this.setAttribute("src", type === "password" 
       // ? "../img/iconos/eye-fill.svg" 
      //  : "../img/iconos/eye-slash-fill.svg");
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
});


// Mostrar/Ocultar confirmar contraseña
document.getElementById("togglePassword4").addEventListener("click", function () {
    const input = document.getElementById("confirmarContrasena");
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
    // Cambia la imagen del ícono
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
});