document.addEventListener('DOMContentLoaded', () => {
  const habitName = document.querySelector('.titulo-habito h1')?.innerText;
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
  });

  btnCalendario.addEventListener('click', () => {
    seccionCalendario.classList.remove('d-none');
    seccionGraficas.classList.add('d-none');
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
  fetch('/api/inicio/completed/details', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const habitosFiltrados = data.filter(h => h.name === habitName);
      console.log('Datos filtrados para el hábito:', habitosFiltrados);
      mostrarGrafica('graficaSemana', habitosFiltrados, 7);
      mostrarGrafica('graficaMes', habitosFiltrados, 30);
      renderizarCalendario(habitosFiltrados);
    })
    .catch(err => {
      console.error('Error al obtener hábitos completados:', err);
    });
});

function mostrarGrafica(canvasId, datos, dias) {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - dias);

  // Agregar unidad a los datos para tooltip
  const datosFiltrados = datos
    .filter(h => new Date(h.date) >= fechaLimite)
    .map(h => ({
      x: h.date,
      y: Number(h.value),
      unit: h.unit  // guardamos la unidad para tooltip
    }));

  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [{
        label: 'Duración',
        data: datosFiltrados,
        backgroundColor: '#007bff'
      }]
    },
  options: {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          const value = context.parsed.y;
          const unit = context.raw.unit || '';
          return `${value} ${unit}`.trim();  // <-- Esto mostrará "30 min"
        }
      }
    },
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Actividad del hábito'
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
      title: {
        display: true,
        text: 'Duración'
      }
    }
    
  }
}

  });
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
