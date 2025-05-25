async function obtenerFechasUnicasDeHabitos() {
  try {
    const response = await fetch('/api/inicio/logs/unique-dates', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener las fechas de seguimiento.');
    }

    const data = await response.json();

    const registrosNormalizados = data.map(item => ({
      dia: item.date,
      cumplido: item.status === 'completed'
    }));

    return registrosNormalizados;

  } catch (error) {
    console.error('Error en obtenerFechasUnicasDeHabitos:', error);
    return [];
  }
}

function calcularRacha(registros) {
  registros.sort((a, b) => new Date(a.dia) - new Date(b.dia));

  let racha = 0;

  for (let i = registros.length - 1; i >= 0; i--) {
    if (registros[i].cumplido) {
      racha++;
    } else {
      break; 
    }
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

document.addEventListener('DOMContentLoaded', async () => {
  const registros = await obtenerFechasUnicasDeHabitos();
  const rachaActual = calcularRacha(registros);

  const streakElement = document.getElementById('streakDays');
  const messageElement = document.getElementById('message');

  animarContador(rachaActual, streakElement);
  messageElement.innerText = `¡Felicidades por cumplir tus hábitos durante ${rachaActual} día${rachaActual !== 1 ? 's' : ''} seguidos!`;
});
