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

    const inputTiempo = document.getElementById('tiempo');
    const mensajeError = document.getElementById('mensaje-error');
    
    inputTiempo.addEventListener('input', function () {
        // Elimina caracteres no numéricos
        this.value = this.value.replace(/\D/g, '');
    
        let valor = parseInt(this.value, 10);
    
        // Mostrar u ocultar el mensaje según el valor
        if (this.value === '' || isNaN(valor) || valor > 60) {
            mensajeError.style.display = 'block';
        } else {
            mensajeError.style.display = 'none';
        }
    
        // Si es mayor a 60, recorta a 60
        if (valor > 60) {
            this.value = 60;
        }
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
