// Simulación de nombre del usuario
const nombre = "Juan";
document.getElementById('nombreUsuario').textContent = nombre;

// Crear calendario dinámico
const dias = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
const hoy = new Date();
const diaActual = hoy.getDay(); // 0 (domingo) a 6 (sábado)
const contenedor = document.getElementById('calendarioSemanal');

for (let i = 0; i < 7; i++) {
  const fecha = new Date(hoy);
  fecha.setDate(hoy.getDate() - diaActual + i);

  const numero = fecha.getDate();
  const dia = dias[fecha.getDay()];
  const esHoy = i === diaActual;

  contenedor.innerHTML += `
    <div class="col calendar-day">
      <div>${numero}</div>
      <div>${dia}</div>
      <div class="calendar-dot ${esHoy ? "active" : ""}"></div>
    </div>
  `;
}

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
