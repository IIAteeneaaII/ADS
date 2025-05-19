document.addEventListener('DOMContentLoaded', () => {
  // --- Funciones auxiliares ---

  const obtenerFechaActual = () => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const dia = hoy.getDate().toString().padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  };
const inputInicio = document.getElementById('fecha-inicio');
const inputFin = document.getElementById('fecha-fin');

  // --- Tabs ---
  const tabs = document.querySelectorAll('.option-semana-mes');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.add('d-none'));

      tab.classList.add('active');
      const selectedId = tab.getAttribute('data-tab');
      document.getElementById(selectedId).classList.remove('d-none');
    });
  });

  // --- Fecha inputs ---
  const inputInicio = document.getElementById('fecha-inicio');
  const inputFin = document.getElementById('fecha-fin');
  const fechaHoy = obtenerFechaActual();

  const pickerInicio = new Pikaday({
    field: inputInicio,
    format: 'YYYY-MM-DD',
    i18n: {
      previousMonth: 'Mes anterior',
      nextMonth: 'Mes siguiente',
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    },
    onSelect: function (date) {
      if (date) {
        inputInicio.value = formatearFecha(date);
        pickerFin.setMinDate(date);
      }
    }
  });

  const pickerFin = new Pikaday({
    field: inputFin,
    format: 'YYYY-MM-DD',
    i18n: pickerInicio.config.i18n,
    minDate: fechaHoy,
    onSelect: function (date) {
      if (date) {
        inputFin.value = formatearFecha(date);
      }
    }
  });

  // --- Botones de toggle ---
  const toggleButtons = document.querySelectorAll('.btn-dias, .dias_notificaciones');
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('selected');
    });
  });

  // --- Botones con Swal ---
  const botonesSwal = [
    { id: 'guardar', icon: 'success', title: '¡Guardado!', text: 'Los datos han sido guardados correctamente.', btnClass: 'btn-primary' },
    { id: 'editar', icon: 'info', title: 'Modo edición', text: 'Puedes editar tu hábito ahora.', btnClass: 'btn-secondary' },
    { id: 'cumplio', icon: 'success', title: '¡Bien hecho!', text: 'Has cumplido con tu objetivo del día.', btnClass: 'btn-primary' },
    { id: 'nocumplio', icon: 'warning', title: '¡Ánimo!', text: 'Mañana será un mejor día.', btnClass: 'btn-secondary' }
  ];

  botonesSwal.forEach(({id, icon, title, text, btnClass}) => {
    const btn = document.getElementById(id);
    btn?.addEventListener('click', () => {
      Swal.fire({
        icon,
        title,
        text,
        customClass: { confirmButton: btnClass },
        confirmButtonText: 'Aceptar'
      });
    });
  });

  // --- Función para actualizar gráficas ---
  let chart24, chartSemana, chartMes;

  function crearGrafica(canvasId, datos, configBase) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (window[canvasId]) {
      window[canvasId].destroy();
    }
    const config = {
      ...configBase,
      data: datos
    };
    window[canvasId] = new Chart(ctx, config);
    return window[canvasId];
  }

  // Configuraciones base para gráficas
  const configBase = {
    type: 'bar',
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  };

  // --- Función para renderizar calendario ---
  function renderizarCalendario(diasHabito) {
    const contenedor = document.getElementById('calendarioHabito');
    const tituloMes = document.getElementById('tituloMes');

    if (!contenedor || !tituloMes) return;

    // Limpiar contenido previo
    contenedor.innerHTML = '';

    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = hoy.getMonth();

    const nombresMeses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    tituloMes.textContent = `${nombresMeses[month]} ${year}`;

    const primerDiaMes = new Date(year, month, 1).getDay();
    const diasEnMes = new Date(year, month + 1, 0).getDate();
    const offset = primerDiaMes === 0 ? 6 : primerDiaMes - 1;

    // Días vacíos antes del 1
    for (let i = 0; i < offset; i++) {
      const diaVacio = document.createElement('div');
      diaVacio.classList.add('dia-habito', 'dia-vacio');
      contenedor.appendChild(diaVacio);
    }

    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fechaStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
      const registro = diasHabito.find(d => d.fecha === fechaStr);

      const circulo = document.createElement('div');
      circulo.classList.add('dia-habito');

      if (registro) {
        circulo.classList.add(registro.cumplido ? 'dia-cumplido' : 'dia-incumplido');
      } else {
        circulo.style.opacity = 0.3;
        circulo.style.backgroundColor = '#999';
      }

      circulo.textContent = dia;
      contenedor.appendChild(circulo);
    }
  }

  // --- Función para obtener datos de API y actualizar ---
  async function cargarDatosHabit() {
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJyaXZlcmEubWFydGluZXouY3Jpc3RoaWFuLmFudG9uaW9AZ21haWwuY29tIiwidXNlck5hbWUiOiJBbnRvemFkYSIsImlhdCI6MTc0NzYxNDgyMSwiZXhwIjoxNzQ3NjE4NDIxfQ.UvqZaMtU7QzCEPaIHPyJMlZaeC0CPTKbmu68ElVW3uE';

      const response = await fetch('http://localhost:3000/api/inicio/completed/details', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener datos: ' + response.statusText);
      }

      const data = await response.json();

      // Supongamos que data tiene esta estructura:
      // {
      //   progreso24h: { labels: [...], data: [...] },
      //   progresoSemana: { labels: [...], data: [...] },
      //   progresoMes: { labels: [...], data: [...] },
      //   calendario: [ {fecha: 'YYYY-MM-DD', cumplido: true/false}, ... ]
      // }

      // Actualizar gráficas
      const datos24 = {
        labels: data.progreso24h.labels,
        datasets: [{ label: 'Hábitos completados', data: data.progreso24h.data, backgroundColor: 'rgba(54, 162, 235, 0.6)' }]
      };
      const datosSemana = {
        labels: data.progresoSemana.labels,
        datasets: [{ label: 'Hábitos completados', data: data.progresoSemana.data, backgroundColor: 'rgba(75, 192, 192, 0.6)' }]
      };
      const datosMes = {
        labels: data.progresoMes.labels,
        datasets: [{ label: 'Hábitos completados', data: data.progresoMes.data, backgroundColor: 'rgba(255, 206, 86, 0.6)' }]
      };

      chart24 = crearGrafica('grafica24', datos24, configBase);
      chartSemana = crearGrafica('graficaSemana', datosSemana, configBase);
      chartMes = crearGrafica('graficaMes', datosMes, configBase);

      // Actualizar calendario
      renderizarCalendario(data.calendario);

    } catch (error) {
      console.error(error);
      // Si hay error, puedes mostrar datos simulados o mensaje al usuario
      console.log('Usando datos simulados por error en API');

      const datosSimulados24 = {
        labels: ['6h', '9h', '12h', '15h', '18h', '21h', '0h'],
        datasets: [{ label: 'Hábitos completados', data: [2, 3, 1, 4, 2, 0, 1], backgroundColor: 'rgba(54, 162, 235, 0.6)' }]
      };
      const datosSimuladosSemana = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{ label: 'Hábitos completados', data: [3, 4, 5, 2, 4, 3, 5], backgroundColor: 'rgba(75, 192, 192, 0.6)' }]
      };
      const datosSimuladosMes = {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [{ label: 'Hábitos completados', data: [10, 15, 12, 18], backgroundColor: 'rgba(255, 206, 86, 0.6)' }]
      };
      chart24 = crearGrafica('grafica24', datosSimulados24, configBase);
      chartSemana = crearGrafica('graficaSemana', datosSimuladosSemana, configBase);
      chartMes = crearGrafica('graficaMes', datosSimuladosMes, configBase);

      const diasHabitoSimulados = [
        { fecha: '2025-05-01', cumplido: true },
        { fecha: '2025-05-02', cumplido: false },
        { fecha: '2025-05-04', cumplido: true },
        { fecha: '2025-05-07', cumplido: false }
      ];
      renderizarCalendario(diasHabitoSimulados);
    }
  }

  // --- Llamar función para cargar datos y actualizar visuales ---
  cargarDatosHabit();

  // --- Funciones auxiliares para mostrar secciones y seleccionar periodos ---
  window.mostrarSeccion = function (seccion) {
    const seccionGraficas = document.getElementById('seccion-graficas');
    const seccionCalendario = document.getElementById('seccion-calendario');
    const botonGraficas = document.getElementById('btn-graficas');
    const botonCalendario = document.getElementById('btn-calendario');

    if (seccion === 'graficas') {
      seccionGraficas.classList.remove('d-none');
      seccionCalendario.classList.add('d-none');
      botonGraficas.classList.replace('btn-secondary', 'btn-primary');
      botonCalendario.classList.replace('btn-primary', 'btn-secondary');
    } else if (seccion === 'calendario') {
      seccionGraficas.classList.add('d-none');
      seccionCalendario.classList.remove('d-none');
      botonGraficas.classList.replace('btn-primary', 'btn-secondary');
      botonCalendario.classList.replace('btn-secondary', 'btn-primary');
    }
  };

  window.seleccionarPeriodo = function (tabId) {
    const btnSemana = document.getElementById('btn-semana');
    const btnMes = document.getElementById('btn-mes');
    const tabSemana = document.getElementById('u-semana');
    const tabMes = document.getElementById('u-mes');

    if (tabId === 'u-semana') {
      tabSemana.classList.remove('d-none');
      tabMes.classList.add('d-none');
      btnSemana.classList.replace('btn-secondary', 'btn-primary');
      btnMes.classList.replace('btn-primary', 'btn-secondary');
    } else if (tabId === 'u-mes') {
      tabSemana.classList.add('d-none');
      tabMes.classList.remove('d-none');
      btnSemana.classList.replace('btn-primary', 'btn-secondary');
      btnMes.classList.replace('btn-secondary', 'btn-primary');
    }
  };

});
