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

document.addEventListener('DOMContentLoaded', () => {
    // Lógica para tabs
    const tabs = document.querySelectorAll('.option');
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

});