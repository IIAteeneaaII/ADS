const HABITOS_MIS = [
    { nombre: 'Estiramientos Matutinos', routeGestion: '/GestionarEstiramientos' },
    { nombre: 'Correr', routeGestion: '/GestionarCorrer' }, 
    { nombre: 'Andar en bicicleta', routeGestion: '/GestionarBici' }, 
    { nombre: 'Saltar la cuerda', routeGestion: '/GestionarSaltarCuerda' },

    { nombre: 'Horas de Dormir', routeGestion: '/GestionarHorasDormir' },
    { nombre: 'Desintoxicación Digital', routeGestion: '/GestionarDesintoxicacionDigital' },
    { nombre: 'Cuidado de la Piel', routeGestion: '/GestionarCuidadoPiel' },
    { nombre: 'Hidratación', routeGestion: '/GestionarHidratacion' },

    { nombre: 'Ordenar Espacio Personal', routeGestion: '/GestionarOrdenarEspacio' },
    { nombre: 'Lectura', routeGestion: '/GestionarLectura' },
    { nombre: 'Meditación', routeGestion: '/GestionarMeditacion' },
    { nombre: 'Escuchar Musica Relajante', routeGestion: '/GestionarMusicaRelajante' },
    
];
document.addEventListener("DOMContentLoaded", async () => {

    try {
        const response = await fetch('http://localhost:3000/api/inicio/all', {
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

        // Redirección al hacer clic
        habitCard.addEventListener('click', () => {
            const habitInfo = HABITOS_MIS.find(h => h.nombre === habito.name);
            if (habitInfo) {
                window.location.href = habitInfo.routeGestion;
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Hábito no disponible',
                    text: 'No se encontró una página de gestión para este hábito.',
                    confirmButtonText: 'Aceptar',
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


