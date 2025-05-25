function toggleContenido(num) {
  const contenido = document.getElementById(`contenido-${num}`);
  contenido.classList.toggle("d-none");

  // Cambiar icono de flecha
  const indiceItem = contenido.previousElementSibling;
  const icono = indiceItem.querySelector("i.fas.fa-chevron-down, i.fas.fa-chevron-up");
  if (icono) {
    icono.classList.toggle("fa-chevron-down");
    icono.classList.toggle("fa-chevron-up");
  }
}
