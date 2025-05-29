
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
            console.log('Respuesta del backend:', data);
            const { logs, frequency } = data;
            const completados = logs.filter(log => log.status === 'completed');
            console.log('Logs del hábito (completados):', completados);
            console.log('Frecuencia del hábito:', frequency);
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
                    return { completados, unidad, frequency };
                });
            });
        })
        .then(({ completados, unidad, frequency }) => {
            limpiarGrafica('graficaSemana');
            limpiarGrafica('graficaMes');
            mostrarGrafica('graficaSemana', completados, 7, unidad, frequency);
            mostrarGrafica('graficaMes', completados, 30, unidad, frequency);
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
        if (canvas._chartInstance) {
            canvas._chartInstance.destroy();
            canvas._chartInstance = null;
        }
    }
}

function mostrarGrafica(canvasId, datos, dias, unidad, frecuencia) {

    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaActual.getDate() - dias);

    const diasPermitidos = frecuencia?.days?.map(d => d.toLowerCase()) || [];
    const nombresDias = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const fechasValidas = [];
    const diasUnicos = new Set();

    for (let d = new Date(fechaLimite); d <= fechaActual; d.setDate(d.getDate() + 1)) {
        const diaNombre = nombresDias[d.getUTCDay()];
        if (diasPermitidos.includes(diaNombre) && !diasUnicos.has(diaNombre)) {
            fechasValidas.push(new Date(d));
            diasUnicos.add(diaNombre);
        }
    }

    const logsMap = datos.reduce((acc, h) => {
        const fecha = new Date(h.date).toISOString().split('T')[0]; // yyyy-mm-dd
        const valor = Number(h.fieldValues?.value || 0);
        acc[fecha] = (acc[fecha] || 0) + valor;
        return acc;
    }, {});

    // Crear arrays de etiquetas y valores alineados según frecuencia
    const datosGrafica = fechasValidas.map(f => {
        const fechaStr = f.toISOString().split('T')[0];
        return {
            x: fechaStr,
            y: logsMap[fechaStr] || 0,
            unit: unidad
        };
    });
    console.log('Datos Grafica', datosGrafica);

    const unidadY = unidad || '';
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

    const getDataColors = opacity => {
        const colors = ['#7448c2', '#21c0d7', '#d99e2b', '#cd3a81', '#9c99cc', '#e14eca', '#ffffff', '#ff0000', '#d6ff00', '#0038ff']
        return colors.map(color => opacity ? `${color + opacity}` : color)
    }

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                label: `Duración (${unidadY})`,
                data: datosGrafica,
                backgroundColor: getDataColors(80)[1],
                borderColor: getDataColors()[1],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
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
                    grid: {
                        display: true,
                        tickLength: 1
                    },
                    ticks: {
                        maxRotation: 90,   // <- fuerza rotación vertical
                        minRotation: 90
                    },
                    title: { display: true, text: 'Fecha' }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: `Duración (${unidadY})` }
                }
            }
        }
    });

    canvas._chartInstance = chart;
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