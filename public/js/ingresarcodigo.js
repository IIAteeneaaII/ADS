document.getElementById("formCodigo").addEventListener("submit", function (event) {
    event.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();
    const contrasena = document.getElementById("nuevaContrasena").value;
    const confirmarContrasena = document.getElementById("confirmarContrasena").value;

    if (codigo === "" || contrasena === "" || confirmarContrasena === "") {
        Swal.fire("Campos vacíos", "Por favor completa todos los campos.", "warning");
        return;
    }

    if (contrasena !== confirmarContrasena) {
        Swal.fire("Error", "Las contraseñas no coinciden.", "error");
        return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(contrasena)) {
        Swal.fire("Contraseña inválida", "Debe tener al menos 8 caracteres, incluyendo letras y números.", "error");
        return;
    }

    const codigoRegex = /^\d{8}$/;
    if (!codigoRegex.test(codigo)) {
        Swal.fire("Código inválido", "El código debe tener exactamente 8 dígitos numéricos.", "error");
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
    this.textContent = type === "password" ? "👁️" : "🙈";
});

// Mostrar/Ocultar confirmar contraseña
document.getElementById("togglePassword4").addEventListener("click", function () {
    const input = document.getElementById("confirmarContrasena");
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
    this.textContent = type === "password" ? "👁️" : "🙈";
});

document.getElementById("reenviarCodigo").addEventListener("click", function () {
    // Mostrar alerta de éxito al reenviar el código
    Swal.fire({
        icon: 'success',
        title: 'Código reenviado',
        text: 'Hemos reenviado el código de verificación a tu correo.',
        customClass: {
            confirmButton: 'btn-secondary'
        },
        confirmButtonText: 'Aceptar'
    });
});