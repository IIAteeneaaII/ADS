document.getElementById("formContrasena").addEventListener("submit", function (event) {
    event.preventDefault();

    const correo = document.getElementById("correo");

    if (correo === "") {
        Swal.fire("Campo vacío", "Por favor ingresa tu correo.", "warning");
        return;
    }

    // Simulamos envío del código
    Swal.fire({
        icon: "success",
        title: "Código enviado",
        text: "Se ha enviado un código a tu correo para recuperar la cuenta.",
        customClass: {
            confirmButton: 'btn-primary'
        },
        confirmButtonText: "Aceptar"
    }).then(() => {
        // Redirige a la siguiente pantalla para ingresar el código
        document.getElementById("solicitarcodigo").classList.add("btn-primary");
        window.location.href = "ingresarcodigo.html"; 
    });
});

// Cancelar
document.querySelector(".btn-secondary").addEventListener("click", function () {
    history.back();
});