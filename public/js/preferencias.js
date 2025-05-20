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
            mostrarAlerta({
                title: 'Seleccion incompleta',
                text: `Solo has seleccionado ${selected.length}.`,
                imageUrl: '/img/sharki/curioso.png',
                redirectUrl: '', 
                btnText: 'Entendido'
            });
        } else {
            mostrarAlerta({
                title: '¡Perfecto!',
                text: 'Tus intereses han sido almacenados',
                imageUrl: '/img/sharki/feliz.png',
                redirectUrl: '/inicio', // Puedes omitir esto si no quieres redireccionar
                btnText: 'Continuar'
            });
        }
    });
});
