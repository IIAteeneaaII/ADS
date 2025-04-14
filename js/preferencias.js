document.addEventListener("DOMContentLoaded", function () {
    const maxSelections = 3;
    const counter = document.getElementById('counter');
    const nextBtn = document.getElementById('nextBtn');

    window.toggleSelection = function (el) {
        const selected = document.querySelectorAll('.option.selected');
        if (el.classList.contains('selected')) {
            el.classList.remove('selected');
        } else if (selected.length < maxSelections) {
            el.classList.add('selected');
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Máximo 3 seleccionados',
                text: 'Solo puedes seleccionar hasta 3 intereses.',
                confirmButtonText: 'Entendido'
            });
        }

        const newCount = document.querySelectorAll('.option.selected').length;
        counter.textContent = `Seleccionado ${newCount}/3`;
        nextBtn.disabled = newCount === 0;
    };

    nextBtn.addEventListener('click', function () {
        const selected = document.querySelectorAll('.option.selected');
        if (selected.length !== maxSelections) {
            Swal.fire({
                icon: 'error',
                title: 'Selecciona 3 gustos',
                text: `Solo haz seleccionado ${selected.length}.`,
                confirmButtonText: 'Ok'
            });
        } else {
            // Aquí va tu lógica si se seleccionaron exactamente 3
            Swal.fire({
                icon: 'success',
                title: '¡Perfecto!',
                text: 'Has seleccionado tus 3 intereses.',
                confirmButtonText: 'Continuar'
            }).then(() => {
                
            });
        }
    });
});
