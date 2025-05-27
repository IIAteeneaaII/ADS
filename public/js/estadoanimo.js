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

botonGuardar.addEventListener('click', async function () {
    if (emocionSeleccionada) {
      // Crear fecha a medianoche UTC real (sin offset de zona horaria)
const hoy = new Date();
const fechaUTC = new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()));
const fecha = fechaUTC.toISOString();

      // Mapeo de emoción a enum
      const emocionesMap = {
        'Feliz': 'HAPPY',
        'Triste': 'SAD',
        'Neutral': 'CALM',
        'Enojado': 'ANGRY'
      };

      const moodEnum = emocionesMap[emocionSeleccionada];

      if (!moodEnum) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Emoción no válida.',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'btn-secondary'
          },
          buttonsStyling: false
        });
      }

      try {
        // ENVÍA LA EMOCIÓN AL BACKEND
        const response = await fetch('/api/auth/mood', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: USER_ID, // 🔁 DEBES definir esto en tu EJS
            date: fecha,
            mood: moodEnum
          })
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: `Has seleccionado: ${emocionSeleccionada}`,
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'btn-secondary'
            },
            buttonsStyling: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: result.error || 'Error al guardar tu estado de ánimo.',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'btn-secondary'
            },
            buttonsStyling: false
          });
        }

      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor.',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'btn-secondary'
          },
          buttonsStyling: false
        });
      }

    } else {
      Swal.fire({
        icon: 'warning',
        title: 'No se seleccionó una emoción',
        text: 'Por favor selecciona una emoción antes de guardar.',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn-secondary'
        },
        buttonsStyling: false
      });
    }
  });
});
