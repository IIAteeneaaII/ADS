document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/inicio/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Error al obtener los hábitos');

        const habits = await response.json();
        renderHabits(habits);
    } catch (error) {
        console.error('Error cargando hábitos:', error);
        Swal.fire('Error', 'No se pudieron cargar los hábitos.', 'error');
    }
});

function renderHabits(habits) {
    const container = document.getElementById('habitsContainer');
    container.innerHTML = '';

    if (habits.length === 0) {
        container.innerHTML = '<h5 class="mt-5 mb-5 text-center">No hay hábitos establecidos por el momento.</h5>';
        return;
    }

    habits.forEach((habito, index) => {
        setTimeout(()=>{
                    const habitContainer = document.createElement('div');
        habitContainer.className = 'd-flex align-items-center mb-3 px-2 fade-in';

        const habitIcon = document.createElement('img');
        habitIcon.src = habito.icon || '/img/default-icon.png';
        habitIcon.alt = 'icono';
        habitIcon.className = 'habit-icon';

        const habitCard = document.createElement('div');
        habitCard.className = 'habit-card my-habits-c w-100';

        const cardContent = document.createElement('div');
        cardContent.className = 'd-flex justify-content-between align-items-center w-100';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'habit-info';
        infoDiv.innerHTML = `<span class="fw-bold">${habito.name}</span>`;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'd-flex align-items-center justify-content-end gap-1 w-auto';

        const valueSpan = document.createElement('span');
        valueSpan.className = 'habit-value-badge';
        valueSpan.textContent = `${habito.fieldValues?.value ?? ''} ${habito.fieldValues?.unit ?? ''}`;

        const arrowSpan = document.createElement('span');
        arrowSpan.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        arrowSpan.classList.add('arrow-icon');

        arrowSpan.addEventListener('click', () => {
            const nombre = habito.name.toLowerCase();

            if (nombre.includes('correr')) {
                window.location.href = `/Correr/${habito.id}`;
            } else if (nombre.includes('bicicleta')) {
                window.location.href = `/bicicleta/${habito.id}`;
            } else if (nombre.includes('cuidado')) {
                window.location.href = `/CuidadoPiel/${habito.id}`;
            } else if (nombre.includes('desintoxicación digital')) {
                window.location.href = `/desintoxicacionDigital/${habito.id}`;
            } else if (nombre.includes('estiramiento')) {
                window.location.href = `/Estiramientos/${habito.id}`;
            } else if (nombre.includes('hidratación') || nombre.includes('hidratacion')) {
                window.location.href = `/Hidratacion/${habito.id}`;
            } else if (nombre.includes('horas')) {
                window.location.href = `/horasdormir/${habito.id}`;
            } else if (nombre.includes('lectura')) {
                window.location.href = `/Lectura/${habito.id}`;
            } else if (nombre.includes('meditación') || nombre.includes('meditacion')) {
                window.location.href = `/Meditacion/${habito.id}`;
            } else if (nombre.includes('escuchar música relajante')) {
                window.location.href = `/MusicaRelajante/${habito.id}`;
            } else if (nombre.includes('ordenar')) {
                window.location.href = `/ordenarespacio/${habito.id}`;
            } else if (nombre.includes('saltar')) {
                window.location.href = `/SaltarCuerda/${habito.id}`;
            } else if (habito.icon?.includes('personalizado') ||
                habito.icon?.includes('bienestar') ||
                habito.icon?.includes('mental') ||
                habito.icon?.includes('movimiento')) {
                window.location.href = `/perso/${habito.id}`;
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Hábito no disponible',
                    text: 'No se encontró una pantalla de gestión para este hábito.'
                });
            }
        });

        actionsDiv.appendChild(valueSpan);
        actionsDiv.appendChild(arrowSpan);

        cardContent.appendChild(infoDiv);
        cardContent.appendChild(actionsDiv);

        habitCard.appendChild(cardContent);
        habitContainer.appendChild(habitIcon);
        habitContainer.appendChild(habitCard);
        container.appendChild(habitContainer);
        }, index * 250)
    });
}
