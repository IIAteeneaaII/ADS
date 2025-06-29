// Validación con JustValidate
const validator = new JustValidate('#formContrasena');

validator
  .addField('#correo', [
    {
      rule: 'required',
      errorMessage: 'El correo es obligatorio',
    },
    {
      rule: 'email',
      errorMessage: 'Ingresa un correo válido',
    },
  ])
  .onSuccess((event) => {
    event.preventDefault();

    const correo = document.getElementById("correo").value.trim();

    Swal.fire({
      title: 'Enviando código...',
      text: 'Por favor espera un momento.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    // Enviar solicitud al servidor
    fetch('/api/auth/recover-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: correo }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          Swal.fire({
          title: "Error",
          text: "Hubo un problema al enviar el código.",
          imageUrl: "/img/sharki/lupa.png",
          imageWidth: 250,
          confirmButtonText: "Aceptar",
          customClass: { confirmButton: 'btn btn-primary' },
          buttonsStyling: false
          });
          return;
        }

        // Mostrar mensaje de éxito y redirigir
      Swal.fire({
          title: 'Enviado',
          text: 'Código enviado exitosamente',
          imageUrl: '../img/sharki/feliz.png',
          imageWidth: 250,
          confirmButtonText: 'Aceptar',
          customClass: { confirmButton: 'btn btn-primary' },
          buttonsStyling: false
      }).then(() => {
          sessionStorage.setItem("recoveryEmail", correo);
          window.location.href = "/ingresarcodigo";
        });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: "Fallo en la conexión con el servidor - Intenta nuevamente.",
          imageUrl: "/img/sharki/lupa.png",
          imageWidth: 250,
          confirmButtonText: "Aceptar",
          customClass: { confirmButton: 'btn btn-primary' },
          buttonsStyling: false
        });

      });
  });

// Botón Cancelar
document.querySelector(".btn-secondary").addEventListener("click", function () {
  window.location.href = "/";
});
