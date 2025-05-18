const btnMenu = document.getElementById('btnMenu');
const menuLateral = document.getElementById('menuLateral');
const overlay = document.getElementById('overlay');

btnMenu.addEventListener('click', () => {
  menuLateral.classList.add('active');
  overlay.classList.add('active');
});

function cerrarMenu() {
  menuLateral.classList.remove('active');
  overlay.classList.remove('active');
}
overlay.addEventListener('click', cerrarMenu);
const logoutModal = document.getElementById('logoutModal');

logoutModal.addEventListener('hidden.bs.modal', () => {
  // Mueve el foco fuera del modal para evitar el error
  document.body.focus(); // o un botón visible fuera del modal
});

document.addEventListener("DOMContentLoaded", () => {
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const hoy = new Date();
  const diaTexto = dias[hoy.getDay()];
  const numero = hoy.getDate();

  const diaSemana = document.getElementById("diaSemana");
  const numeroDia = document.getElementById("numeroDia");

  if (diaSemana && numeroDia) {
    diaSemana.textContent = diaTexto;
    numeroDia.textContent = numero;
  } else {
    console.warn("No se encontraron los elementos con IDs 'diaSemana' o 'numeroDia'");
  }

  const botonTodoElDia = document.querySelector('.time-buttons button:nth-child(4)');
  if (botonTodoElDia) {
    botonTodoElDia.click();
  }
});

const seccionHabitos = document.getElementById('seccion-de-habitos');

async function cargarHabitos() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  seccionHabitos.innerHTML = '';

  try {
    const response = await fetch('/api/inicio/principalScr', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    const habitos = await response.json();

    if (habitos.length === 0) {
      seccionHabitos.innerHTML = `
        <p>Hmm, no hay ningún hábito establecido por el momento.<br>
        Presiona el botón “Crear nuevo hábito” para crear tu primer hábito y comenzar a cumplir tus objetivos.</p>
      `;
    } else {
      habitos.forEach(habito => {
        const habitContainer = document.createElement('div');
        habitContainer.className = 'd-flex align-items-center mb-3 px-2';

        const habitIcon = document.createElement('img');
        habitIcon.src = habito.icon;
        habitIcon.alt = 'icono';
        habitIcon.classList.add('habit-icon');

        const habitCard = document.createElement('div');
        habitCard.className = 'habit-card d-flex justify-content-between align-items-center p-3 flex-grow-1 shadow-sm';

        const checkCircle = document.createElement('div');
        checkCircle.className = 'check-circle';

        let status = habito.logs.status === 'complete' ? 'complete' : 'pending';
        if (status === 'complete') {
          checkCircle.classList.add('complete');
        }

        const cardContent = `
          <div class="d-flex flex-column">
            <span class="fw-bold">${habito.name}</span>
          </div>
          <div class="d-flex align-items-center">
            <span class="habit-value-badge">
              ${habito.fieldValues?.value ?? ''} ${habito.fieldValues?.unit ?? ''}
            </span>
          </div>
        `;

        habitCard.innerHTML = cardContent;
        habitCard.querySelector('.d-flex.align-items-center:last-child').appendChild(checkCircle);

        habitCard.addEventListener('click', (e) => {
          if (e.target.classList.contains('check-circle')) return;
          checkCircle.style.display = checkCircle.style.display === 'none' ? 'block' : 'none';
        });

        checkCircle.addEventListener('click', async function (e) {
          e.stopPropagation();
          status = status === 'complete' ? 'pending' : 'complete';
          checkCircle.classList.toggle('complete');
          checkCircle.classList.add('scale');
          setTimeout(() => checkCircle.classList.remove('scale'), 150);

          try {
            const res = await fetch('/api/inicio/actualizarlogs', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                userHabitId: habito.id,
                date: today,
                status: status
              })
            });

            const result = await res.json();

            if (!res.ok) {
              throw new Error(result.error || 'Error al actualizar');
            }

            console.log('Respuesta del servidor:', result.message);
          } catch (error) {
            console.error('Error actualizando el estado del hábito:', error);
          }
        });

        habitContainer.appendChild(habitIcon);
        habitContainer.appendChild(habitCard);
        seccionHabitos.appendChild(habitContainer);
      });
    }
  } catch (error) {
    console.error('Error cargando hábitos:', error);
    seccionHabitos.innerHTML = '<p>Error al cargar los hábitos.</p>';
  }
}


// Llamar a la función de carga de hábitos cuando la página se carga
window.addEventListener('load', cargarHabitos);

//  Logout: borrar cookies y token, redirigir al login
document.getElementById('confirmarLogout').addEventListener('click', () => {
  // Borra todas las cookies accesibles desde JavaScript
  document.cookie.split(";").forEach(cookie => {
    const name = cookie.split("=")[0].trim();
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  });
  // Elimina el token JWT del almacenamiento local
  localStorage.removeItem('token');
  window.location.href = '/';
});
