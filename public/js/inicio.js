// Simulación de nombre del usuario
const nombre = "Juan";
document.getElementById('nombreUsuario').textContent = nombre;

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

const botonTodoElDia = document.querySelector('.time-buttons button:nth-child(4)'); 
const seccionHabitos = document.getElementById('seccion-de-habitos');

botonTodoElDia.addEventListener('click', async () => {
  seccionHabitos.innerHTML = '';

  try {
    const response = await fetch('http://localhost:3000/api/inicio/principalScr', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const habitos = await response.json();

    if (habitos.length === 0) {
      seccionHabitos.innerHTML = '<p>Hmm, no hay ningún hábito establecido por el momento.<br>Presiona el botón “Crear +” para crear tu primer hábito.</p>';
    } else {
      habitos.forEach(habito => {
        const habitCard = document.createElement('div');
        habitCard.className = 'habit-card mb-3 d-flex justify-content-between align-items-center p-3';
        habitCard.style.backgroundColor = '#a3b8cc';
        habitCard.style.borderRadius = '12px';
        habitCard.style.color = '#000';
      
        habitCard.innerHTML = `
          <span class="fw-bold ms-2">${habito.name}</span>
          <span style="
            background-color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: 500;
            margin-right: 10px;
          ">${habito.reminderTime.hour}:${habito.reminderTime.minute.toString().padStart(2, '0')}</span>
        `;
      
        seccionHabitos.appendChild(habitCard);
      });
      
    }
  } catch (error) {
    console.error('Error cargando hábitos:', error);
    seccionHabitos.innerHTML = '<p>Error al cargar los hábitos.</p>';
  }
});

document.getElementById('confirmarLogout').addEventListener('click', () => {
  // Implementar la lógica para borrar las cookies
});
