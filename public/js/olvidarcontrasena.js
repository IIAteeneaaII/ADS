document.getElementById("formContrasena").addEventListener("submit", function (event) {
    event.preventDefault();

    const correo = document.getElementById("correo").value.trim();  // Asegúrate de tomar el valor

    if (!correo) {
        Swal.fire("Campo vacío", "Por favor ingresa tu correo.", "warning");
        return;
    }

    // Enviar solicitud al servidor para generar y enviar código
    fetch('http://localhost:3000/api/auth/recover-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: correo })
    })
    .then(async response => {
        const data = await response.json();

        if (!response.ok) {
            // Si hay un error (por ejemplo, el correo no existe)
            Swal.fire("Error", data.message || "Hubo un problema al enviar el código.", "error");
            return;
        }

        // Si todo va bien, muestra un mensaje de éxito
        Swal.fire({
            icon: "success",
            title: "Código enviado",
            text: "Se ha enviado un código a tu correo para recuperar la cuenta.",
            customClass: {
                confirmButton: 'btn-primary'
            },
            confirmButtonText: "Aceptar"
        }).then(() => {
            // Redirige a la página donde se ingresa el código de recuperación
            window.location.href = "/OlvidarContrasena";
        });
    })
    .catch(err => {
        console.error(err);
        Swal.fire("Error", "Hubo un error al comunicarse con el servidor.", "error");
    });
});

// Cancelar
document.querySelector(".btn-secondary").addEventListener("click", function () {
    history.back();
});
