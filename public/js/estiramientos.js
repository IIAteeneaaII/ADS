document.addEventListener('DOMContentLoaded', () => {
    // Lógica para tabs
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

    // -------- FECHAS --------
    const formatearFecha = (fecha) => {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return fecha.toLocaleDateString('es-ES', opciones);
    };

    const obtenerFechaActual = () => {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
        const dia = hoy.getDate().toString().padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    };

    const inputInicio = document.getElementById('fecha-inicio');
    const inputFin = document.getElementById('fecha-fin');

    const fechaHoy = obtenerFechaActual();

    // Convertir la fecha a español antes de asignarla
    const fechaFormateadaHoy = formatearFecha(new Date());

    inputInicio.value = fechaFormateadaHoy;
    inputFin.value = fechaFormateadaHoy;

    // Pikaday configuración para el input de inicio
    const pickerInicio = new Pikaday({
        field: inputInicio,
        format: 'YYYY-MM-DD', // Formato interno
        i18n: {
            previousMonth: 'Mes anterior',
            nextMonth: 'Mes siguiente',
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
        },
        onSelect: function (date) {
            if (date) {
                // Mostrar la fecha en formato largo
                inputInicio.value = formatearFecha(date);
                pickerFin.setMinDate(date); // Actualizar el mínimo de fecha de fin
            }
        }
    });

    // Pikaday configuración para el input de fin
    const pickerFin = new Pikaday({
        field: inputFin,
        format: 'YYYY-MM-DD', // Formato interno
        i18n: {
            previousMonth: 'Mes anterior',
            nextMonth: 'Mes siguiente',
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
        },
        minDate: fechaHoy, // Fecha mínima para el fin
        onSelect: function (date) {
            if (date) {
                inputFin.value = formatearFecha(date); // Mostrar la fecha en formato largo
            }
        }
    });
    // Alternar clase 'selected' para días y notificaciones
    const toggleButtons = document.querySelectorAll('.btn-dias, .dias_notificaciones');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
        });
    });
    // Botón Guardar
    const guardarBtn = document.getElementById('guardar');
    guardarBtn?.addEventListener('click', () => {
        Swal.fire({
            icon: 'success',
            title: '¡Guardado!',
            text: 'Los datos han sido guardados correctamente.',
            customClass: {
                confirmButton: 'btn-primary'
            },
            confirmButtonText: 'Aceptar'
        });
    });

    // Botón Editar
    const editarBtn = document.getElementById('editar');
    editarBtn?.addEventListener('click', () => {
        Swal.fire({
            icon: 'info',
            title: 'Modo edición',
            text: 'Puedes editar tu hábito ahora.',
            customClass: {
                confirmButton: 'btn-secondary'
            },
            confirmButtonText: 'Aceptar'
        });
    });

    // Botón Cumplió
    const cumplioBtn = document.getElementById('cumplio');
    cumplioBtn?.addEventListener('click', () => {
        Swal.fire({
            icon: 'success',
            title: '¡Bien hecho!',
            text: 'Has cumplido con tu objetivo del día.',
            customClass: {
                confirmButton: 'btn-primary'
            },
            confirmButtonText: 'Aceptar'
        });
    });

    // Botón No cumplió
    const noCumplioBtn = document.getElementById('nocumplio');
    noCumplioBtn?.addEventListener('click', () => {
        Swal.fire({
            icon: 'warning',
            title: '¡Ánimo!',
            text: 'Mañana será un mejor día.',
            customClass: {
                confirmButton: 'btn-secondary'
            },
            confirmButtonText: 'Aceptar'
        });
    });
});


function confirmarEliminacion(nombreHabito) {
    Swal.fire({
      title: '¿Eliminar hábito?',
      html: `¿Estás seguro de que deseas eliminar <strong>${nombreHabito}</strong>?`,
      icon: 'warning',
      width: '350px',
      showCancelButton: true,
      customClass:{
        confirmButtonColor: 'btn-primary',
      cancelButtonColor: 'btn-secondary'
      },
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `eliminar.php?id=${id}`;
      }
    });
  }



  //Simulacion de la graficas

  const datosSimulados24 = {
    labels: ['6h', '9h', '12h', '15h', '18h', '21h', '0h'],
    datasets: [{
      label: 'Hábitos completados',
      data: [2, 3, 1, 4, 2, 0, 1],
      backgroundColor: 'rgba(54, 162, 235, 0.6)'
    }]
  };
  
  const datosSimuladosSemana = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{
      label: 'Hábitos completados',
      data: [3, 4, 5, 2, 4, 3, 5],
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  };
  
  const datosSimuladosMes = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [{
      label: 'Hábitos completados',
      data: [10, 15, 12, 18],
      backgroundColor: 'rgba(255, 206, 86, 0.6)'
    }]
  };
  
  const config24 = {
    type: 'bar',
    data: datosSimulados24,
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  };
  
  const configSemana = {
    type: 'bar',
    data: datosSimuladosSemana,
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  };
  
  const configMes = {
    type: 'bar',
    data: datosSimuladosMes,
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  };
  
  window.addEventListener('DOMContentLoaded', () => {
    const canvas24 = document.getElementById('grafica24');
    const canvasSemana = document.getElementById('graficaSemana');
    const canvasMes = document.getElementById('graficaMes');
  
    if (canvas24) new Chart(canvas24, config24);
    if (canvasSemana) new Chart(canvasSemana, configSemana);
    if (canvasMes) new Chart(canvasMes, configMes);
  });

  
  document.addEventListener('DOMContentLoaded', function () {
    const diasHabito = [
        { fecha: '2025-05-01', cumplido: true },
        { fecha: '2025-05-02', cumplido: false },
        { fecha: '2025-05-04', cumplido: true },
        { fecha: '2025-05-07', cumplido: false },
        // Agrega más fechas si quieres
    ];

    const contenedor = document.getElementById('calendarioHabito');
    const tituloMes = document.getElementById('tituloMes');

    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = hoy.getMonth(); // 0 = Enero

    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    tituloMes.textContent = `${nombresMeses[month]} ${year}`;

    const primerDiaMes = new Date(year, month, 1).getDay(); // 0 = Domingo
    const diasEnMes = new Date(year, month + 1, 0).getDate();

    // Ajustar para que el calendario inicie en lunes (opcional)
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
});

function mostrarSeccion(seccion) {
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
}



function seleccionarPeriodo(tabId) {
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
}

