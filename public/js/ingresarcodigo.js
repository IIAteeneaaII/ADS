document.getElementById("formCodigo").addEventListener("submit", function (event) {
    event.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();

    if (codigo === "") {
        Swal.fire("Campos vacíos", "Por favor completa todos los campos.", "warning");
        return;
    }
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


