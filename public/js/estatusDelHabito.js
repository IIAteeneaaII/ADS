
document.addEventListener('DOMContentLoaded', () => {
  const pathParts = window.location.pathname.split('/');
  const habitId = pathParts[2];

  const token = localStorage.getItem('token');

  const seccionGraficas = document.getElementById('seccion-graficas');
  const seccionCalendario = document.getElementById('seccion-calendario');
  const btnGraficas = document.getElementById('btn-graficas');
  const btnCalendario = document.getElementById('btn-calendario');
  const btnSemana = document.getElementById('btn-semana');
  const btnMes = document.getElementById('btn-mes');
  const graficaSemana = document.getElementById('u-semana');
  const graficaMes = document.getElementById('u-mes');

  // Mostrar por defecto gráficas semanales
  seccionGraficas.classList.remove('d-none');
  seccionCalendario.classList.add('d-none');
  graficaSemana.classList.remove('d-none');
  graficaMes.classList.add('d-none');

  // Botones para alternar sección
  btnGraficas.addEventListener('click', () => {
    seccionGraficas.classList.remove('d-none');
    seccionCalendario.classList.add('d-none');
    btnGraficas.classList.replace('btn-secondary', 'btn-primary');
    btnCalendario.classList.replace('btn-primary', 'btn-secondary');
  });

  btnCalendario.addEventListener('click', () => {
    seccionCalendario.classList.remove('d-none');
    seccionGraficas.classList.add('d-none');
    btnGraficas.classList.replace('btn-primary', 'btn-secondary');
    btnCalendario.classList.replace('btn-secondary', 'btn-primary');
  });

  // Botones para cambiar entre semana y mes
  btnSemana.addEventListener('click', () => {
    graficaSemana.classList.remove('d-none');
    graficaMes.classList.add('d-none');
    btnSemana.classList.replace('btn-secondary', 'btn-primary');
    btnMes.classList.replace('btn-primary', 'btn-secondary');
  });

  btnMes.addEventListener('click', () => {
    graficaSemana.classList.add('d-none');
    graficaMes.classList.remove('d-none');
    btnSemana.classList.replace('btn-primary', 'btn-secondary');
    btnMes.classList.replace('btn-secondary', 'btn-primary');
  });

  // Fetch y renderizado de datos
  fetch(`/api/inicio/${habitId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('No autorizado o hábito no encontrado');
      return res.json();
    })
    .then(data => {
      const completados = data.filter(log => log.status === 'completed');
      console.log('Logs del hábito (completados):', completados);

      //Unidades de la grafica
      return fetch(`/api/inicio/Units/${habitId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => {
        if (!res.ok) throw new Error('No se encontraron las unidades');
        return res.json().then(unidad => {
          console.log('Unidad recibida:', unidad);
          return { completados, unidad };
        });
      });
    })
    .then(({ completados, unidad }) => {
      limpiarGrafica('graficaSemana');
      limpiarGrafica('graficaMes');
      mostrarGrafica('graficaSemana', completados, 7, unidad);
      mostrarGrafica('graficaMes', completados, 30, unidad);
      renderizarCalendario(completados);
    })
    .catch(err => {
      console.error('Error al cargar datos del hábito:', err);
      // Swal.fire('Error', 'No se pudo cargar la información del hábito.', 'error');
    });
});

function limpiarGrafica(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (canvas) {
    const context = canvas.getContext('2d');
    if (context) context.clearRect(0, 0, canvas.width, canvas.height);
    // También elimina el gráfico existente si Chart.js lo creó antes
    if (canvas._chartInstance) {
      canvas._chartInstance.destroy();
      canvas._chartInstance = null;
    }
  }
}

function mostrarGrafica(canvasId, datos, dias, unidad) {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - dias);

  const agrupados = datos
    .filter(h => new Date(h.date) >= fechaLimite)
    .reduce((acc, h) => {
      const fecha = new Date(h.date).toISOString().split('T')[0]; // yyyy-mm-dd
      const duracion = Number(h.fieldValues?.value || 0);

      if (!acc[fecha]) acc[fecha] = 0;
      acc[fecha] += duracion;
      return acc;
    }, {});

  const datosGrafica = Object.entries(agrupados).map(([fecha, valor]) => ({
    x: fecha,
    y: valor,
    unit: unidad
  }));

  const unidadY = unidad || '';
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return;

     // 🎨 Crear un degradado para el color de las barras
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#ffffff'); // Azul oscuro
  gradient.addColorStop(1, '#80bdff'); // Azul claro
  
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [{
        label: `Duración (${unidadY})`,
        data: datosGrafica,
        backgroundColor: gradient,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: context => `${context.parsed.y} ${context.raw.unit || ''}`
          }
        },
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Actividad del hábito'
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          color: '#333',
          font: {
            weight: 'bold'
          },
          formatter: function (value) {
            return `${value.y}`;
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: dias === 7 ? 'day' : 'week',
            tooltipFormat: 'dd/MM/yyyy',
          },
          title: {
            display: true,
            text: 'Fecha'
          }
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: `Duración (${unidadY})` },
          ticks: {
            callback: value => `${value} ${unidadY}`
          }
        }
      }
    }
  });
  
  // Guardar instancia para posible limpieza
  if (canvas) canvas._chartInstance = chart;
}

function renderizarCalendario(datos) {
  const contenedor = document.getElementById('calendarioHabito');
  contenedor.innerHTML = '';

  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();
  const primerDia = new Date(año, mes, 1);
  const ultimoDia = new Date(año, mes + 1, 0);
  const diasMes = ultimoDia.getDate();
  const primerDiaSemana = primerDia.getDay(); // 0 (domingo)

  const fechasCompletadas = datos
    .filter(h => {
      const fecha = new Date(h.date);
      return fecha.getFullYear() === año && fecha.getMonth() === mes;
    })
    .map(h => new Date(h.date).getDate());
  console.log('Días completados en el mes:', fechasCompletadas);
  // Título del mes
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  document.getElementById('tituloMes').textContent = `${meses[mes]} ${año}`;

  // Días vacíos antes del 1
  const offset = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
  for (let i = 0; i < offset; i++) {
    const div = document.createElement('div');
    div.classList.add('dia-vacio');
    contenedor.appendChild(div);
  }

  // Días del mes
  for (let i = 1; i <= diasMes; i++) {
    const div = document.createElement('div');
    div.classList.add('dia');
    div.textContent = i;
    if (fechasCompletadas.includes(i)) {
      div.classList.add('completado');
    }
    contenedor.appendChild(div);
  }
}

//Animaciones
// Generador de burbujas dinámicas
function crearBurbuja() {
  const contenedor = document.getElementById('contenedor-burbujas');
  const burbuja = document.createElement('div');
  const tamaño = Math.random() * 20 + 10;

  burbuja.classList.add('burbuja');
  burbuja.style.width = `${tamaño}px`;
  burbuja.style.height = `${tamaño}px`;
  burbuja.style.left = `${Math.random() * 100}%`;
  burbuja.style.animationDuration = `${Math.random() * 5 + 5}s`;
  burbuja.style.opacity = Math.random();

  contenedor.appendChild(burbuja);

  // Eliminar burbuja cuando termine la animación
  setTimeout(() => {
    burbuja.remove();
  }, 10000);
}

// Crear burbujas periódicamente
setInterval(crearBurbuja, 300);