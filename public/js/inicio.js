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
});
