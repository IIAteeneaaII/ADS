document.addEventListener('DOMContentLoaded', () => {
    const pathParts = window.location.pathname.split('/');
    const habitId = pathParts[2];

    const token = localStorage.getItem('token');

    const seccionGraficas = document.getElementById('seccion-graficas');
    const seccionCalendario = document.getElementById('seccion-calendario');
    const btnGraficas = document.getElementById('btn-graficas');
    const btnCalendario = document.getElementById('btn-calendario');
    // const btnSemana = document.getElementById('btn-semana');
    // const btnMes = document.getElementById('btn-mes');
    const graficaSemana = document.getElementById('u-semana');
    // const graficaMes = document.getElementById('u-mes');
    const btnSemanaAnterior = document.getElementById('semana-anterior');
    const btnSemanaSiguiente = document.getElementById('semana-siguiente');
    const textoSemana = document.getElementById('rango-semana');

    let semanaOffset = 0;
    let datosCompletados = [];
    let unidadActual = '';
    let frecuenciaActual = null;

    seccionGraficas.classList.remove('d-none');
    seccionCalendario.classList.add('d-none');
    graficaSemana.classList.remove('d-none');
    // graficaMes.classList.add('d-none');

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

    // btnSemana.addEventListener('click', () => {
    //     graficaSemana.classList.remove('d-none');
    //     graficaMes.classList.add('d-none');
    //     btnSemana.classList.replace('btn-secondary', 'btn-primary');
    //     btnMes.classList.replace('btn-primary', 'btn-secondary');
    // });

    // btnMes.addEventListener('click', () => {
    //     graficaSemana.classList.add('d-none');
    //     graficaMes.classList.remove('d-none');
    //     btnSemana.classList.replace('btn-primary', 'btn-secondary');
    //     btnMes.classList.replace('btn-secondary', 'btn-primary');
    // });

    btnSemanaAnterior.addEventListener('click', () => {
        semanaOffset -= 1;
        actualizarGraficaSemana();
    });

    btnSemanaSiguiente.addEventListener('click', () => {
        semanaOffset += 1;
        actualizarGraficaSemana();
    });

    fetch(`/api/inicio/${habitId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => {
            if (!res.ok) throw new Error('No autorizado o hábito no encontrado');
            return res.json();
        })
        .then(data => {
            const { logs, frequency } = data;
            const completados = logs.filter(log => log.status === 'completed');
            return fetch(`/api/inicio/Units/${habitId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => {
                if (!res.ok) throw new Error('No se encontraron las unidades');
                return res.json().then(unidad => {
                    return { completados, unidad, frequency };
                });
            });
        })
        .then(({ completados, unidad, frequency }) => {
            datosCompletados = completados;
            unidadActual = unidad;
            frecuenciaActual = frequency;

            limpiarGrafica('graficaMes');
            mostrarGrafica('graficaMes', completados, 30, unidad, frequency);
            actualizarGraficaSemana();
            renderizarCalendario(completados);
        })
        .catch(err => {
            console.error('Error al cargar datos del hábito:', err);
        });

    function actualizarGraficaSemana() {
        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay() + (semanaOffset * 7));
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);

        const rangoTexto = `${inicioSemana.toLocaleDateString()} - ${finSemana.toLocaleDateString()}`;
        textoSemana.textContent = rangoTexto;

        limpiarGrafica('graficaSemana');
        mostrarGrafica('graficaSemana', datosCompletados, 7, unidadActual, frecuenciaActual, inicioSemana);
    }
});

function limpiarGrafica(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas && canvas._chartInstance) {
        canvas._chartInstance.destroy();
        canvas._chartInstance = null;
    }
}

function mostrarGrafica(canvasId, datos, dias, unidad, frecuencia, desdeFecha = null) {
    const fechaInicio = desdeFecha ? new Date(desdeFecha) : new Date();
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaInicio.getDate() + dias - 1);

    const diasPermitidos = frecuencia?.days?.map(d => d.toLowerCase()) || [];
    const nombresDias = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const etiquetaDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']; 

    const fechasValidas = [];

    for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
        const diaNombre = nombresDias[d.getDay()];
        if (diasPermitidos.includes(diaNombre)) {
            fechasValidas.push(new Date(d.getFullYear(), d.getMonth(), d.getDate())); // clone por valor
        }
    }

    const logsMap = datos.reduce((acc, h) => {
        const fecha = new Date(h.date).toISOString().split('T')[0];
        const valor = Number(h.fieldValues?.value || 0);
        acc[fecha] = (acc[fecha] || 0) + valor;
        return acc;
    }, {});

    const datosGrafica = fechasValidas.map(f => {
        const fechaStr = f.toISOString().split('T')[0];
        return {
            x: etiquetaDias[f.getDay()],
            y: logsMap[fechaStr] || 0,
            unit: unidad
        };
    });
    console.log('Datos Grafica', datosGrafica);

    const canvas = document.getElementById(canvasId);
    
    const hayDatos = datosGrafica.some(d => d.y > 0); 
    const imgVacia = document.getElementById(canvasId === 'graficaSemana' ? 'imgSemanaVacia' : 'imgMesVacia'); 

    if (!canvas) return;

    if(!hayDatos){
        canvas.classList.add('d-none'); 
        imgVacia.classList.remove('d-none'); 
        return; 
    }
    else{
        canvas.classList.remove('d-none'); 
        imgVacia.classList.add('d-none'); 
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxY = Math.max(...datosGrafica.map(d => d.y));

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                label: `Duración (${unidad})`,
                data: datosGrafica,
                backgroundColor: '#21c0d780',
                borderColor: '#21c0d7',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                datalabels: {
                    anchor: 'center',
                    align: 'center',
                    rotation: -90, // rotar texto de abajo hacia arriba
                    font: { weight: 'bold' },
                    color: '#000',
                    formatter: value => value.y > 0 ? value.y : null
                },
                tooltip: {
                    callbacks: {
                        label: context => `${context.raw.x}: ${context.raw.y} ${context.raw.unit || ''}`
                    }
                },
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Actividad del hábito'
                }
            },
            scales: {
                x: {
                    type: 'category',
                    ticks: {
                        maxRotation: 0,
                        minRotation: 0
                    },
                    title: { display: true, text: 'Día de la semana' }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: val => (val === 0 || val === maxY ? val : '')
                    },
                    title: { display: true, text: `Duración (${unidad})` }
                }
            }
        },
        plugins: [ChartDataLabels]
    });

    canvas._chartInstance = chart;
}

function renderizarCalendario(completados) {
    const contenedor = document.getElementById('calendarioHabito');
    const tituloMes = document.getElementById('tituloMes');
    if (!contenedor || !tituloMes) return;

    // Limpiar contenido previo
    contenedor.innerHTML = '';

    // Obtener fecha actual
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = hoy.getMonth(); // 0 = enero
    const primerDiaMes = new Date(año, mes, 1);
    const ultimoDiaMes = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDiaMes.getDate();
    const diaSemanaInicio = primerDiaMes.getDay(); // 0 (domingo) a 6 (sábado)

    // Mostrar nombre del mes
    const nombreMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    tituloMes.textContent = `${nombreMeses[mes]} ${año}`;

    // Crear set de fechas completadas para acceso rápido
    const fechasCompletadas = new Set(
        completados.map(log => new Date(log.date).toISOString().split('T')[0])
    );

    // Agregar espacios vacíos antes del primer día (si no empieza en domingo)
    for (let i = 0; i < diaSemanaInicio; i++) {
        const espacio = document.createElement('div');
        espacio.classList.add('dia');
        contenedor.appendChild(espacio);
    }

    // Crear los días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fecha = new Date(año, mes, dia).toISOString().split('T')[0];
        const div = document.createElement('div');
        div.classList.add('dia');
        div.textContent = dia;

        if (fechasCompletadas.has(fecha)) {
            div.classList.add('dia-completado');
        }

        contenedor.appendChild(div);
    }
}


function crearBurbuja() {
    const contenedor = document.getElementById('contenedor-burbujas');
    const burbuja = document.createElement('div');
    const tamaño = Math.random() * 20 + 10;

    burbuja.classList.add('burbuja');
    burbuja.style.width = `${tamaño}px`;
    burbuja.style.height = `${tamaño}px`;
    burbuja.style.left = `${Math.random() * 100}%`;
    burbuja.style.animationDuration = `${Math.random() * 5 + 5}s`;
    burbuja.style.opacity = 0;


    contenedor.appendChild(burbuja);

    // Eliminar burbuja cuando termine la animación
    setTimeout(() => {
        burbuja.remove();
    }, 10000);
}

// Crear burbujas periódicamente
setInterval(crearBurbuja, 100);


//Despliegue de descripcion
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('descripcionToggle');
    const collapseElement = document.getElementById('infoCollapse');
    const collapseInstance = new bootstrap.Collapse(collapseElement, {
      toggle: false // no lo abra automáticamente
    });

    toggle.addEventListener('click', function () {
      collapseInstance.toggle();
    });
  });