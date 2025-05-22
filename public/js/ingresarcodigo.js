const form = document.getElementById("formCodigo");
const btnReenviar = document.getElementById("btnReenviarCodigo");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();
    const email = sessionStorage.getItem("recoveryEmail");

    if (codigo === "" || !email) {
      Swal.fire("Campos vacíos", "Por favor completa todos los campos.", "warning");
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
          icon: 'success',
          title: 'Código válido',
          text: 'El código es correcto, ahora puedes cambiar tu contraseña.',
        }).then(() => {
          window.location.href = '/cambiocontrasena';
        });
      } else {
        Swal.fire('Error', data.message || 'Código inválido o expirado', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un error validando el código', 'error');
    }
  });
}

if (btnReenviar) {
  btnReenviar.addEventListener("click", async function () {
    const email = sessionStorage.getItem("recoveryEmail");

    if (!email) {
      Swal.fire("Error", "No se encontró el correo. Vuelve a iniciar el proceso.", "error");
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
        Swal.fire("Código reenviado", "Revisa tu correo electrónico.", "success");
      } else {
        Swal.fire("Error", data.message || "No se pudo reenviar el código.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al reenviar el código.", "error");
    } finally {
      // Habilitar botón después de 30 segundos
      setTimeout(() => {
        btnReenviar.disabled = false;
      }, 30000);
    }
  });
}
