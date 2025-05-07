const nombreElemento = document.getElementById('nombreUsuario');
const inputNombre = document.getElementById("inputNombreUsuario");
const icono = document.getElementById("iconEditar");
const fotoInput = document.getElementById("fotoInput");
const imagenPerfil = document.querySelector(".perfil-foto");

let editando = false;
let nuevaFoto = null;

icono.addEventListener("click", async () => {
  if (!editando) {
    inputNombre.value = nombreElemento.textContent.trim();
    nombreElemento.classList.add("d-none");
    inputNombre.classList.remove("d-none");
    icono.classList.replace("fa-edit", "fa-check");
    editando = true;
  } else {
    const nuevoNombre = inputNombre.value.trim();
    if (!nuevoNombre) {
      Swal.fire('Error', 'El nombre de usuario no puede estar vacío.', 'error');
      return;
    }
    await actualizarPerfil(nuevoNombre, nuevaFoto);
  }
});

fotoInput.addEventListener('change', async function (event) {
  const file = event.target.files[0];
  if (file) {
    nuevaFoto = file;
    imagenPerfil.src = URL.createObjectURL(file);
    await actualizarPerfil(nombreElemento.textContent.trim(), nuevaFoto);
  }
});

async function actualizarPerfil(nombre, foto) {
  const formData = new FormData();
  formData.append("userName", nombre || ''); // evitar null/undefined

  if (foto) {
    formData.append("profilePic", foto);
  }

  try {
    const response = await fetch('/api/auth/user/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json' // ← esto fuerza JSON en la respuesta
      },
      body: formData
    });

    // verifica tipo de contenido (respuesta esperada)
    const contentType = response.headers.get("content-type") || '';
    if (!contentType.includes("application/json")) {
      throw new Error("Respuesta no válida del servidor (probablemente HTML)");
    }

    const result = await response.json();

    if (response.ok) {
      nombreElemento.textContent = result.user.userName;
      if (result.user.profilePic) {
        imagenPerfil.src = result.user.profilePic;
      }

      inputNombre.classList.add("d-none");
      nombreElemento.classList.remove("d-none");
      icono.classList.replace("fa-check", "fa-edit");
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
