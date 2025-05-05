const nombreElemento = document.getElementById('nombreUsuario');
const inputNombre = document.getElementById("inputNombreUsuario");
const icono = document.getElementById("iconEditar");

// Valor inicial
nombreElemento.textContent = "Juan";

// Estado de edición
let editando = false;

icono.addEventListener("click", () => {
    if (!editando) {
      // Activar edición
      inputNombre.value = nombreElemento.textContent;
      nombreElemento.classList.add("d-none");
      inputNombre.classList.remove("d-none");
      icono.classList.replace("fa-edit", "fa-check");
      editando = true;
    } else {
      // Guardar cambios
      nombreElemento.textContent = inputNombre.value;
      nombreElemento.classList.remove("d-none");
      inputNombre.classList.add("d-none");
      icono.classList.replace("fa-check", "fa-edit");
      editando = false;

       // Mostrar mensaje con SweetAlert
       Swal.fire({
            icon: 'success',
            title: '¡Actualización exitosa!',
            text: 'Tu nombre de usuario se ha actualizado correctamente.',
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary'},
            buttonsStyling: false // Desactiva los estilos predeterminados de SweetAlert2
        });
    }
});

document.getElementById('fotoInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
      const avatar = document.querySelector('.perfil-foto');
      avatar.src = URL.createObjectURL(file);

      Swal.fire({
          icon: 'success',
          title: 'Foto actualizada',
          text: 'Tu foto de perfil se ha actualizado correctamente.',
          confirmButtonText: 'Aceptar',
          customClass: { confirmButton: 'btn btn-primary' },
          buttonsStyling: false
      });
  }
});


