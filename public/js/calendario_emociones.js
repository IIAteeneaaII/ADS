const diasContainer = document.getElementById("diasCalendario");
const nombreMes = document.getElementById("nombreMes");

const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
               "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

let fechaActual = new Date();

function renderizarCalendario() {
  const year = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();
  const primerDia = new Date(year, mes, 1).getDay();
  const diasEnMes = new Date(year, mes + 1, 0).getDate();

  diasContainer.innerHTML = "";
  nombreMes.textContent = `${meses[mes]} de ${year}`;

  for (let i = 0; i < primerDia; i++) {
    const espacio = document.createElement("div");
    espacio.classList.add("dia-vacio");
    diasContainer.appendChild(espacio);
  }

  for (let dia = 1; dia <= diasEnMes; dia++) {
    const diaDiv = document.createElement("div");
    diaDiv.classList.add("dia");

    const clave = `${year}-${mes + 1}-${dia}`;
    const emocion = localStorage.getItem(clave);

    const emojiSpan = document.createElement("span");
    emojiSpan.classList.add("emoji");
    emojiSpan.textContent = emocion ? obtenerEmoji(emocion) : "";

    const numeroSpan = document.createElement("span");
    numeroSpan.classList.add("numero-dia");
    numeroSpan.textContent = dia;

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
    case "Feliz": return "😄";
    case "Triste": return "😢";
    case "Neutral": return "😐";
    case "Enojado": return "😠";
    default: return "❓";
  }
}

function cambiarMes(valor) {
  fechaActual.setMonth(fechaActual.getMonth() + valor);
  renderizarCalendario();
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarCalendario();

  const btnSiguiente = document.querySelector(".btn-next-mes");
  const btnAnterior = document.querySelector(".btn-prev-mes");

  if (btnSiguiente) {
    btnSiguiente.addEventListener("click", () => cambiarMes(1));
  }

  if (btnAnterior) {
    btnAnterior.addEventListener("click", () => cambiarMes(-1));
  }
});
