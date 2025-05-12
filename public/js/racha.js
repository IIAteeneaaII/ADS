    // Supón que este es el resultado de tu base de datos
    const registrosDeHabitos = [
      { dia: '2025-05-03', cumplido: true },
      { dia: '2025-05-04', cumplido: false },
      { dia: '2025-05-05', cumplido: true },
      { dia: '2025-05-10', cumplido: true },
      { dia: '2025-05-11', cumplido: true },
    ];

    function calcularRacha(registros) {
      let racha = 0;
      for (let i = registros.length - 1; i >= 0; i--) {
        if (registros[i].cumplido) racha++;
        else break;
      }
      return racha;
    }

    function animarContador(valorFinal, elemento, velocidad = 50) {
      let contador = 0;
      const incremento = Math.ceil(valorFinal / 20);
      const intervalo = setInterval(() => {
        contador += incremento;
        if (contador >= valorFinal) {
          contador = valorFinal;
          clearInterval(intervalo);
        }
        elemento.innerText = contador;
      }, velocidad);
    }

    const rachaActual = calcularRacha(registrosDeHabitos);
    const streakElement = document.getElementById('streakDays');
    const messageElement = document.getElementById('message');

    animarContador(rachaActual, streakElement);
    messageElement.innerText = `¡Felicidades por cumplir tus hábitos durante ${rachaActual} día${rachaActual !== 1 ? 's' : ''} seguidos!`;