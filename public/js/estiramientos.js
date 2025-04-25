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

});
