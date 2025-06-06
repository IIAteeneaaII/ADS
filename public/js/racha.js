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
  // Ordena y filtra solo los días cumplidos
  const fechasCumplidas = new Set(
    registros
      .filter(r => r.cumplido)
      .map(r => new Date(r.dia).toISOString().split('T')[0])
  );

  let racha = 0;
  let fecha = new Date();
  fecha.setHours(0, 0, 0, 0);

  // Cuenta hacia atrás mientras haya días consecutivos cumplidos
  while (fechasCumplidas.has(fecha.toISOString().split('T')[0])) {
    racha++;
    fecha.setDate(fecha.getDate() - 1);
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
  const diaSemana = hoy.getDay(); // 0 (domingo) a 6 (sábado)
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - ((diaSemana + 6) % 7)); // ajusta para que inicie en lunes

  const dias = [];
  const nombres = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  for (let i = 0; i < 7; i++) {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + i);
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

  // Mostrar mensaje de felicitación
  messageElement.innerText = rachaActual > 0
    ? `¡Felicidades por cumplir tus hábitos durante ${rachaActual} día${rachaActual !== 1 ? 's' : ''} seguidos!`
    : `¡Aún estás a tiempo de empezar tu racha hoy!`;

  // Mostrar la semana actual de lunes a domingo
  const semana = obtenerSemanaActual();

  semana.forEach(dia => {
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
