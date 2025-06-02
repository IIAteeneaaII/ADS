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

    // Habilitar el botón y cambiar estilo
  const botonGuardar = document.querySelector('.btn-save');
  botonGuardar.disabled = false;
  botonGuardar.style.backgroundColor = '#60a9fa'; 
  botonGuardar.style.color = '#f8f9fa';           
  botonGuardar.style.cursor = 'pointer';
  botonGuardar.style.transition = 'background-color 0.3s ease';
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const botonGuardar = document.querySelector('.btn-save');

    // Estado inicial del botón
  botonGuardar.disabled = true;
  botonGuardar.style.backgroundColor = '#bfddfe'; 
  botonGuardar.style.color = '#f8f9fa';
  botonGuardar.style.cursor = 'not-allowed';
  botonGuardar.style.transition = 'background-color 0.3s ease';

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
          title: 'Error',
          text: 'Emoción no válida.',
          imageUrl: '/img/sharki/lupa.png',
          imageWidth: 250,
          confirmButtonText: 'Aceptar',
          customClass: { confirmButton: 'btn btn-primary' },
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
            title: '¡Guardado!',
            text: `Has seleccionado: ${emocionSeleccionada}`,
            imageUrl: '/img/sharki/feliz.png',
            imageWidth: 250,
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: result.error || 'Error al guardar tu estado de ánimo.',
            imageUrl: '/img/sharki/lupa.png',
            imageWidth: 250,
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          });
        }

      } catch (error) {
        console.error(error);
          Swal.fire({
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor.',
            imageUrl: '/img/sharki/lupa.png',
            imageWidth: 250,
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          });
      }

    } else {
      Swal.fire({
        title: 'No se seleccionó una emoción',
        text: 'Por favor selecciona una emoción antes de guardar.',
        imageUrl: '/img/sharki/lupa.png',
        imageWidth: 250,
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'btn btn-primary' },
        buttonsStyling: false
      });
    }
  });
});
