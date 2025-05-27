const diasContainer = document.getElementById("diasCalendario");
const nombreMes = document.getElementById("nombreMes");

const meses = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

let fechaActual = new Date();

function renderizarCalendario() {
  const year = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();

  const primerDiaSemana = new Date(year, mes, 1).getDay(); // Día de la semana (0 = domingo)
  const diasEnMes = new Date(year, mes + 1, 0).getDate(); // Días totales del mes

  diasContainer.innerHTML = "";
  nombreMes.textContent = `${meses[mes]} de ${year}`;

  // Espacios vacíos antes del primer día del mes
  for (let i = 0; i < primerDiaSemana; i++) {
    const espacio = document.createElement("div");
    espacio.classList.add("dia-vacio");
    diasContainer.appendChild(espacio);
  }

  // Días del mes
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const diaDiv = document.createElement("div");
    diaDiv.classList.add("dia");

    // Construir fecha YYYY-MM-DD
    const diaStr = `${year}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

    // Obtener emoción si existe
    const emocion = moodsFromServer[diaStr];

    const emojiSpan = document.createElement("span");
    emojiSpan.classList.add("emoji");
    emojiSpan.textContent = emocion ? obtenerEmoji(emocion) : "";

    const numeroSpan = document.createElement("span");
    numeroSpan.classList.add("numero-dia");
    numeroSpan.textContent = dia;

    // Marcar hoy
    const hoy = new Date();
    const esHoy =
      dia === hoy.getDate() &&
      mes === hoy.getMonth() &&
      year === hoy.getFullYear();

    if (esHoy) {
      diaDiv.classList.add("dia-hoy");
    }

    diaDiv.appendChild(emojiSpan);
    diaDiv.appendChild(numeroSpan);
    diasContainer.appendChild(diaDiv);
  }
}

function obtenerEmoji(emocion) {
  switch (emocion) {
    case "HAPPY": return "😄";
    case "SAD": return "😢";
    case "CALM": return "😐";
    case "ANGRY": return "😠";
    default: return "❓";
  }
}

function cambiarMes(valor) {
  fechaActual.setMonth(fechaActual.getMonth() + valor);
  renderizarCalendario();
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarCalendario();
});
