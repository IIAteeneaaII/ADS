// Variable para guardar la emoción seleccionada
let emocionSeleccionada = null;

function seleccionarEmocion(elemento) {
  // Quitar selección previa
  document.querySelectorAll('.emotion-option .emotion-icon').forEach(el => el.classList.remove('selected'));

  // Marcar actual como seleccionada
  const icono = elemento.querySelector('.emotion-icon');
  icono.classList.add('selected');

  // Guardar la emoción seleccionada (leer el texto de la etiqueta)
  emocionSeleccionada = elemento.querySelector('.emotion-label').textContent.trim();
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const botonGuardar = document.querySelector('.btn-save');

  botonGuardar.addEventListener('click', function() {
    if (emocionSeleccionada) {
      // Si hay una emoción seleccionada, mostrar SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: `Has seleccionado: ${emocionSeleccionada}`,
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: 'btn-secondary',
        },
        buttonsStyling: false
      });

      // Para enviar la emoción a tu base de datos
      console.log("Emoción para guardar:", emocionSeleccionada);
      
    } else {
      // Si no hay emoción seleccionada, mostrar advertencia
      Swal.fire({
        icon: 'warning',
        title: 'No se selecciono una emocion',
        text: 'Por favor selecciona una emoción antes de guardar.',
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: 'btn-secondary',
        },
        buttonsStyling: false
      });
    }
  });
});
