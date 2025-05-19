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
        container.innerHTML = '<p class="text-muted">No tienes hábitos registrados.</p>';
        return;
    }

    habits.forEach(habito => {
        const habitContainer = document.createElement('div');
        habitContainer.className = 'd-flex align-items-center mb-3';

        const habitIcon = document.createElement('img');
        habitIcon.src = habito.icon || '/img/default-icon.png';
        habitIcon.alt = 'icono';
        habitIcon.style.width = '40px';
        habitIcon.style.height = '40px';
        habitIcon.style.marginRight = '10px';

        const habitCard = document.createElement('div');
        habitCard.className = 'card_gestionar';
        habitCard.style.color = '#000';
        habitCard.style.cursor = 'pointer';

        habitCard.addEventListener('click', () => {
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
            } else if (nombre.includes('musica')) {
                window.location.href = `/MusicaRelajante/${habito.id}`;
            } else if (nombre.includes('ordenar')) {
                window.location.href = `/ordenarespacio/${habito.id}`;
            } else if (nombre.includes('saltar')) {
                window.location.href = `/SaltarCuerda/${habito.id}`;
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Hábito no disponible',
                    text: 'No se encontró una pantalla de gestión para este hábito.'
                });
            }
        });

        const cardContent = document.createElement('div');
        cardContent.className = 'w-100 d-flex justify-content-between align-items-center';

        cardContent.innerHTML = `
            <div class="d-flex align-items-center">
                <span class="fw-bold">${habito.name}</span>
            </div>
            <div class="d-flex align-items-center">
                <span style="
                    background-color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 500;
                    margin-right: 12px;
                ">
                    ${habito.fieldValues?.value ?? ''} ${habito.fieldValues?.unit ?? ''}
                </span>
                <span style="font-size: 1.5rem;">›</span>
            </div>
        `;

        habitCard.appendChild(cardContent);
        habitContainer.appendChild(habitIcon);
        habitContainer.appendChild(habitCard);
        container.appendChild(habitContainer);
    });
}