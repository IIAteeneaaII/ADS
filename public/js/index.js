document.addEventListener('DOMContentLoaded', function () {
  // Toggle de contraseña en login
  const togglePassword = document.getElementById("togglePassword");
  if (togglePassword) {
    togglePassword.addEventListener("click", function () {
      const passwordInput = document.getElementById("contrasena");
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      this.textContent = type === "password" ? "👁️" : "🙈";
    });
  }

  // Manejo del formulario de login
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("correo").value;
      const password = document.getElementById("contrasena").value;

      if (!email || !password) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor completa todos los campos.',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {

          Swal.fire({
            icon: 'success',
            title: 'Sesión iniciada',
            text: 'Se ha accedido correctamente.',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'btn btn-primary'
            }
          }).then(() => {
          });

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.msg || 'Error al iniciar sesión.',
            confirmButtonText: 'Aceptar'
          });
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error de red o del servidor.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  // Cargar registro dinámicamente
  const btnRegistro = document.getElementById("MostrarRegistro");
  if (btnRegistro) {
    btnRegistro.addEventListener("click", () => cargarVista('registro'));
  }
});

function cargarVista(nombreVista) {
  fetch(`/partials/${nombreVista}`)
    .then(response => response.text())
    .then(html => {
      document.getElementById('contenido-dinamico').innerHTML = html;

      if (nombreVista === 'registro') {
        // Mostrar login otra vez si el usuario hace clic en "¿Ya tienes cuenta?"
        const btnVolverLogin = document.getElementById('btnMostrarLogin');
        if (btnVolverLogin) {
          btnVolverLogin.addEventListener('click', () => cargarVista('main'));
        }
      }
    })
    .catch(error => console.error('Error al cargar la vista:', error));
}
