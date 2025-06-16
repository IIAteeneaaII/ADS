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
  // Ordena los registros de más reciente a más antiguo
  registros.sort((a, b) => new Date(b.dia) - new Date(a.dia));

  let racha = 0;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  for (let i = 0; i < registros.length; i++) {
    const fecha = new Date(registros[i].dia);
    fecha.setHours(0, 0, 0, 0);

    const esHoy = fecha.getTime() === hoy.getTime();

    if (registros[i].cumplido) {
      racha++;
    } else if (!esHoy) {
      // Solo interrumpimos si el día no es hoy y está marcado como no cumplido
      break;
    }
    // Si es hoy y no cumplido, no sumamos pero tampoco cortamos
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

function obtenerSemanaActual() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diaSemana = hoy.getDay(); // 0 (domingo) a 6 (sábado)
  
  const lunes = new Date(hoy);
  const diasDesdeLunes = (diaSemana + 6) % 7; // convierte domingo (0) en 6, lunes (1) en 0...
  lunes.setDate(hoy.getDate() - diasDesdeLunes);

  const dias = [];
  const nombres = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  for (let i = 0; i < 7; i++) {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + i);
    fecha.setHours(0, 0, 0, 0);
    dias.push({
      fecha: fecha.toISOString().split('T')[0],
      nombre: nombres[i]
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

  messageElement.innerText = rachaActual > 0
    ? `¡Felicidades por cumplir tus hábitos durante ${rachaActual} día${rachaActual !== 1 ? 's' : ''} seguidos!`
    : `¡Aún estás a tiempo de empezar tu racha hoy!`;

  // Días de la semana
  const semana = obtenerSemanaActual();
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const hoyStr = hoy.toISOString().split('T')[0];

  semana.forEach(dia => {
    const cumplido = registros.some(r =>
      new Date(r.dia).toISOString().split('T')[0] === dia.fecha && r.cumplido
    );

    const div = document.createElement('div');
    div.classList.add('day-box');
    if (cumplido) div.classList.add('checked');
    if (dia.fecha === hoyStr) div.classList.add('hoy');

    div.innerHTML = `${dia.nombre} ${cumplido ? '<i class="fas fa-check"></i>' : ''}`;
    daysRow.appendChild(div);
  });
});
