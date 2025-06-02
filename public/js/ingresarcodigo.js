
const form = document.getElementById("formCodigo");
const btnReenviar = document.getElementById("btnReenviarCodigo");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();
    const email = sessionStorage.getItem("recoveryEmail");

    if (codigo === "" || !email) {
      Swal.fire({
        title: "Campos vacíos",
        text: "Por favor completa todos los campos.",
        imageUrl: "/img/sharki/lupa.png",
        imageWidth: 250,
        confirmButtonText: "Aceptar",
        customClass: { confirmButton: 'btn btn-primary' },
        buttonsStyling: false
      });

      return;
    }

    try {
      const res = await fetch('/api/auth/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codigo }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
            title: "¡Código válido!",
            text: "El código es correcto, ahora puedes cambiar tu contraseña.",
            imageUrl: "/img/sharki/feliz.png",
            imageWidth: 250,
            confirmButtonText: "Continuar",
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
        }).then(() => {
        window.location.href = '/cambiocontrasena';
        });

      } else {
            Swal.fire({
                title: "Error",
                text: data.message || "Código inválido o expirado",
                imageUrl: "/img/sharki/lupa.png",
                imageWidth: 250,
                confirmButtonText: "Aceptar",
                customClass: { confirmButton: 'btn btn-primary' },
                buttonsStyling: false
            });

      }
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "Hubo un error validando el código.",
            imageUrl: "/img/sharki/lupa.png",
            imageWidth: 250,
            confirmButtonText: "Aceptar",
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
        });

    }
  });
}

if (btnReenviar) {
  btnReenviar.addEventListener("click", async function () {
    const email = sessionStorage.getItem("recoveryEmail");

    if (!email) {
        Swal.fire({
            title: "Error",
            text: "No se encontró el correo. Vuelve a iniciar el proceso.",
            imageUrl: "/img/sharki/lupa.png",
            imageWidth: 250,
            confirmButtonText: "Aceptar",
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
        });

      return;
    }

    try {
      btnReenviar.disabled = true;
      const res = await fetch('/api/auth/recover-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
            title: "¡Código reenviado!",
            text: "Revisa tu correo electrónico.",
            imageUrl: "/img/sharki/feliz.png",
            imageWidth: 250,
            confirmButtonText: "Aceptar",
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
        });

      } else {
        Swal.fire({
            title: "Error",
            text: data.message || "No se pudo reenviar el código.",
            imageUrl: "/img/sharki/lupa.png",
            imageWidth: 250,
            confirmButtonText: "Aceptar",
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
        });

      }
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al reenviar el código.",
            imageUrl: "/img/sharki/lupa.png",
            imageWidth: 250,
            confirmButtonText: "Aceptar",
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
        });

    } finally {
      // Habilitar botón después de 30 segundos
      setTimeout(() => {
        btnReenviar.disabled = false;
      }, 30000);
    }
  });
}
