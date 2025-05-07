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

const seccionHabitos = document.getElementById('seccion-de-habitos');

async function cargarHabitos() {
  seccionHabitos.innerHTML = '';

  try {
    //habitos del usuario del dia
    const response = await fetch('http://localhost:3000/api/inicio/principalScr', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const habitos = await response.json();

    //seguimiento del habito de el dia (se completo o no)(falta implementar)

    // HTML
    if (habitos.length === 0) {
      seccionHabitos.innerHTML = '<p>Hmm, no hay ningún hábito establecido por el momento.<br>Presiona el botón “Crear +” para crear tu primer hábito.</p>';
    } else {
      habitos.forEach(habito => {
        const habitContainer = document.createElement('div');
        habitContainer.className = 'd-flex align-items-center mb-3';
      
        const habitIcon = document.createElement('img');
        habitIcon.src = habito.icon;
        habitIcon.alt = 'icono';
        habitIcon.style.width = '40px';
        habitIcon.style.height = '40px';
        habitIcon.style.marginRight = '10px';
      
        const habitCard = document.createElement('div');
        habitCard.className = 'd-flex justify-content-between align-items-center p-3 flex-grow-1';
        habitCard.style.backgroundColor = '#a3b8cc';
        habitCard.style.borderRadius = '12px';
        habitCard.style.color = '#000';
        habitCard.style.position = 'relative';
      
        let isChecked = false;
      
        const checkCircle = document.createElement('div');
        checkCircle.className = 'check-circle';
        checkCircle.style.width = '24px';
        checkCircle.style.height = '24px';
        checkCircle.style.borderRadius = '50%';
        checkCircle.style.border = '2px solid #000';
        checkCircle.style.backgroundColor = 'white';
        checkCircle.style.cursor = 'pointer';
        checkCircle.style.display = 'none';
        checkCircle.style.transition = 'background-color 0.3s';
      

        // ${habito.fieldValues.value} ${habito.fieldValues.unit}
        const cardContent = `
          <div class="d-flex align-items-center">
            <span class="fw-bold">${habito.name}</span>
          </div>
          <div class="d-flex align-items-center">
            <span style="
              background-color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-weight: 500;
              margin-right: 12px;
              ">
          ${habito.fieldValues?.value ?? ''} ${habito.fieldValues?.unit ?? ''}
</span>

          </div>
        `;
      
        habitCard.innerHTML = cardContent;
        habitCard.querySelector('.d-flex.align-items-center:last-child').appendChild(checkCircle);
      
        habitCard.addEventListener('click', (e) => {
          if (e.target.classList.contains('check-circle')) return;
      
          if (checkCircle.style.display === 'none') {
            checkCircle.style.display = 'block';
          } else {
            checkCircle.style.display = 'none';
          }
        });
      
        checkCircle.addEventListener('click', function (e) {
          e.stopPropagation();
      
          isChecked = !isChecked;
      
          if (isChecked) {
            this.style.backgroundColor = 'green';
            console.log('Hábito completado'); //enviar a base true
          } else {
            this.style.backgroundColor = 'white';
            console.log('Hábito desmarcado'); //enviar a base false
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
