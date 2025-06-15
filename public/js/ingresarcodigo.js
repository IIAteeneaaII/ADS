const form = document.getElementById("formCodigo");
const btnReenviar = document.getElementById("btnReenviarCodigo");
const inputCodigo = document.getElementById("codigo");
const errorDiv = document.getElementById("codigoError");

if (inputCodigo) {
  inputCodigo.addEventListener('input', () => {
    inputCodigo.value = inputCodigo.value.replace(/\D/g, '');
  });
}

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const codigo = inputCodigo.value.trim();
    const email = sessionStorage.getItem("recoveryEmail");

    // Mostrar errores personalizados debajo del input
    if (codigo === "") {
      errorDiv.textContent = "El código es obligatorio.";
      errorDiv.style.display = "block";
      return;
    } else if (!/^\d{6}$/.test(codigo)) {
      errorDiv.textContent = "Debe tener exactamente 6 dígitos.";
      errorDiv.style.display = "block";
      return;
    } else {
      errorDiv.style.display = "none";
    }

    if (!email) {
      Swal.fire({
        title: "Error",
        text: "No se encontró un correo en sesión.",
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
          imageUrl: "/img/sharki/triste.png",
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
        imageUrl: "/img/sharki/triste.png",
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
          text: data.message || "Hubo un problema al reenviar el código.",
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
      setTimeout(() => {
        btnReenviar.disabled = false;
      }, 30000);
    }
  });
}
