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
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  for (let i = registros.length - 1; i >= 0; i--) {
    const fecha = new Date(registros[i].dia);
    fecha.setHours(0, 0, 0, 0);
    if (registros[i].cumplido) {
      racha++;
    } else if (fecha.getTime() === hoy.getTime()) {
      continue;
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

function obtenerUltimos7Dias() {
  const dias = [];
  const nombres = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  const hoy = new Date();
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - i);
    dias.push({
      fecha: fecha.toISOString().split('T')[0],
      nombre: nombres[fecha.getDay()]
    });
  }
  return dias;
}

document.addEventListener('DOMContentLoaded', async () => {
  const registros = await obtenerFechasUnicasDeHabitos();
  const rachaActual = calcularRacha(registros);

  const streakElement = document.getElementById('streakDays');
  const messageElement = document.getElementById('message');
  const daysRow = document.getElementById('daysRow');

  animarContador(rachaActual, streakElement);

  //  Mostrar mensaje de felicitación
  messageElement.innerText = rachaActual > 0
    ? `¡Felicidades por cumplir tus hábitos durante ${rachaActual} día${rachaActual !== 1 ? 's' : ''} seguidos!`
    : `¡Aún estás a tiempo de empezar tu racha hoy!`;

  //  Mostrar los últimos 7 días
  const ultimosDias = obtenerUltimos7Dias();

  ultimosDias.forEach(dia => {
    const cumplido = registros.find(r =>
      new Date(r.dia).toISOString().split('T')[0] === dia.fecha && r.cumplido
    );

    const div = document.createElement('div');
    div.classList.add('day-box');
    if (cumplido) div.classList.add('checked');
    div.innerHTML = `${dia.nombre} ${cumplido ? '<i class="fas fa-check"></i>' : ''}`;
    daysRow.appendChild(div);
  });
});
