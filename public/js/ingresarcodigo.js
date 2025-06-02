document.getElementById("formCodigo").addEventListener("submit", function (event) {
    event.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();

    if (codigo === "") {
        Swal.fire({
            title: 'Campos vacíos',
            text: 'Por favor completa todos los campos.',
            imageUrl: '/img/sharki/lupa.png', 
            imageWidth: 250,
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
        });

        return;
    }
});

document.getElementById("reenviarCodigo").addEventListener("click", function () {
    // Mostrar alerta de éxito al reenviar el código
    Swal.fire({
        title: '¡Código reenviado!',
        text: 'Hemos reenviado el código de verificación a tu correo.',
        imageUrl: '/img/sharki/feliz.png',
        imageWidth: 250,
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'btn btn-primary' },
        buttonsStyling: false
    });

});
