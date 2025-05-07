document.getElementById("formCodigo").addEventListener("submit", async function (event) {
    event.preventDefault();

    const codigo = document.getElementById("codigo").value.trim(); // token
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

    try {
        const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: codigo,
                newPassword: contrasena,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Contraseña cambiada",
                text: "Tu nueva contraseña ha sido registrada. Inicia sesión.",
                confirmButtonText: "Aceptar"
            }).then(() => {
                window.location.href = "/"; // Redirige al login
            });
        } else {
            Swal.fire("Error", data.message || "No se pudo cambiar la contraseña.", "error");
        }
    } catch (error) {
        console.error("Error al hacer la solicitud:", error);
        Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
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
