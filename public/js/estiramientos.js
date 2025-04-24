document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.option');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Desactivar todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.add('d-none'));

            // Activar la pestaña clicada
            tab.classList.add('active');
            const selectedId = tab.getAttribute('data-tab');
            document.getElementById(selectedId).classList.remove('d-none');
        });
    });
});
