// Variable para guardar el habito seleccionado
let habitoSeleccionado = null;

function seleccionarHabito(elemento) {
  // Quitar selección previa
  document.querySelectorAll('.habit-item .habit-icon').forEach(el => el.classList.remove('selected'));

  // Marcar actual como seleccionada
  const icono = elemento.querySelector('.habit-icon');
  icono.classList.add('selected');

  // Guardar la emoción seleccionada (leer el texto de la etiqueta)
  habitoSeleccionado = elemento.querySelector('.habit-label').textContent.trim();
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const botonContinuar = document.querySelector('.btn-continue');

  botonContinuar.addEventListener('click', function() {
    if (habitoSeleccionado) {
      // Si hay una emoción seleccionada, mostrar SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Continuar',
        text: `Has seleccionado: ${habitoSeleccionado}`,
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: 'btn-secondary',
        },
        buttonsStyling: false
      });

      // Para enviar la emoción a tu base de datos
      console.log("Emoción para guardar:", habitoSeleccionado);
      
    } else {
      // Si no hay emoción seleccionada, mostrar advertencia
      Swal.fire({
        icon: 'warning',
        title: 'No se selecciono un hábito',
        text: 'Por favor selecciona un hábito antes de continuar.',
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: 'btn-secondary',
        },
        buttonsStyling: false
      });
    }
  });
});