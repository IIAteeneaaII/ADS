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

    // Enviar solicitud al servidor
    fetch('http://localhost:3000/api/auth/recover-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: correo }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          Swal.fire("Error", data.message || "Hubo un problema al enviar el código.", "error");
          return;
        }

        // Mostrar mensaje de éxito y redirigir
        Swal.fire({
          icon: "success",
          title: "Código enviado",
          text: "Se ha enviado un código a tu correo para recuperar la cuenta.",
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton: 'btn-primary',
          },
        }).then(() => {
          sessionStorage.setItem("recoveryEmail", correo);
          window.location.href = "/ingresarcodigo";
        });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "Hubo un error al comunicarse con el servidor.", "error");
      });
  });

// Botón Cancelar
document.querySelector(".btn-secondary").addEventListener("click", function () {
  window.location.href = "/";
});
