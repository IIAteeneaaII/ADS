const nombreElemento = document.getElementById('nombreUsuario');
const inputNombre = document.getElementById("inputNombreUsuario");
const btnEditar = document.getElementById("btnEditar");
const btnGuardar = document.getElementById("btnGuardar");
const fotoInput = document.getElementById("fotoInput");
const imagenPerfil = document.querySelector(".perfil-foto");

let editando = false;
let nuevaFoto = null;

btnEditar.addEventListener("click", () => {
  inputNombre.value = nombreElemento.textContent.trim();
  nombreElemento.classList.add("d-none");
  inputNombre.classList.remove("d-none");

  btnEditar.classList.add("d-none");
  btnGuardar.classList.remove("d-none");
  editando = true;
});

btnGuardar.addEventListener("click", async () => {
  const nuevoNombre = inputNombre.value.trim();
  if (!nuevoNombre) {
    Swal.fire('Error', 'El nombre de usuario no puede estar vacío.', 'error');
    return;
  }

  await actualizarPerfil(nuevoNombre, nuevaFoto);
});

fotoInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    nuevaFoto = file;
    imagenPerfil.src = URL.createObjectURL(file); // vista previa
  }
});

async function actualizarPerfil(nombre, foto) {
  const formData = new FormData();
  formData.append("userName", nombre || '');

  if (foto) {
    formData.append("profilePic", foto);
  }

  try {
    const response = await fetch('/api/auth/user/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json'
      },
      body: formData
    });

    const contentType = response.headers.get("content-type") || '';
    if (!contentType.includes("application/json")) {
      throw new Error("Respuesta no válida del servidor.");
    }

    const result = await response.json();

    if (response.ok) {
      nombreElemento.textContent = result.user.userName;
      if (result.user.profilePic) {
        imagenPerfil.src = result.user.profilePic;
      }

      inputNombre.classList.add("d-none");
      nombreElemento.classList.remove("d-none");

      btnEditar.classList.remove("d-none");
      btnGuardar.classList.add("d-none");

      nuevaFoto = null;
      editando = false;

      Swal.fire({
        icon: 'success',
        title: '¡Perfil actualizado!',
        text: 'Los cambios se guardaron correctamente.',
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'btn btn-primary' },
        buttonsStyling: false
      });
    } else {
      throw new Error(result.message || 'No se pudo actualizar el perfil');
    }
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    Swal.fire('Error', err.message, 'error');
  }
}
