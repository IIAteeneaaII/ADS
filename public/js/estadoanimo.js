function seleccionarEmocion(elemento) {
    // Quitar selección previa
    document.querySelectorAll('.emotion-option .emotion-icon').forEach(el => el.classList.remove('selected'));
  
    // Marcar actual como seleccionada
    const icono = elemento.querySelector('.emotion-icon');
    icono.classList.add('selected');
  }
  