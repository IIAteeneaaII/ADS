document.addEventListener("DOMContentLoaded", function () {
    const maxSelections = 3;
    const counter = document.getElementById('counter');
    const nextBtn = document.getElementById('nextBtn');

    window.toggleSelection = function (el) {
        const selected = document.querySelectorAll('.optionpr.selected');
        
        // Verifica si la clase ya está presente y actúa según el caso
        if (el.classList.contains('selected')) {
            el.classList.remove('selected');
        } else if (selected.length < maxSelections) {
            el.classList.add('selected');
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Máximo 3 seleccionados',
                text: 'Solo puedes seleccionar hasta 3 intereses.',
                customClass: {
                    confirmButton: 'btn-secondary',
                },
                confirmButtonText: 'Entendido'
            });
        }

        // Actualiza el contador y habilita el botón de "Siguiente" si es necesario
        const newCount = document.querySelectorAll('.optionpr.selected').length;
        console.log(`Nuevo contador: ${newCount}/3`); // Para depuración
        counter.textContent = `Seleccionado ${newCount}/3`;
        nextBtn.disabled = newCount === 0;
    };

    nextBtn.addEventListener('click', function () {
        const selected = document.querySelectorAll('.optionpr.selected');
        // console.log(`Seleccionados al hacer clic en "Siguiente": ${selected.length}`); // Para depuración

        if (selected.length !== maxSelections) {
            Swal.fire({
                icon: 'error',
                title: 'Selecciona 3 gustos',
                text: `Solo has seleccionado ${selected.length}.`,
                customClass: {
                    confirmButton: 'btn-secondary',
                },
                confirmButtonText: 'Aceptar'
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: '¡Perfecto!',
                text: 'Has seleccionado tus 3 intereses.',
                customClass: {
                    confirmButton: 'btn-secondary'
                },
                confirmButtonText: 'Continuar'
            }).then(() => {
                document.getElementById("nextBtn").classList.add("btn-secondary");
                window.location.href = "/inicio"; // ir al inicio
            });
        }
    });
});
