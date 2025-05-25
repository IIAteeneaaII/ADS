const HABITOS = {
    movimiento: [
        { img: '/img/gestorhabitos/estiramiento.png', nombre: 'Estiramientos matutinos', link: '/GestionarEstiramientos' },
        { img: '/img/gestorhabitos/correr.png', nombre: 'Correr', link: '/GestionarCorrer' },
        { img: '/img/gestorhabitos/bici.png', nombre: 'Andar en bicicleta', link: '/GestionarBicicleta' },
        { img: '/img/gestorhabitos/saltar-la-cuerda.png', nombre: 'Saltar la cuerda', link: '/GestionarSaltarCuerda' }
    ],
    bienestar: [
        { img: '/img/gestorhabitos/dormir.png', nombre: 'Horas de Dormir', link: '/GestionarHorasDormir' },
        { img: '/img/gestorhabitos/sintelefono.png', nombre: 'Desintoxicación Digital', link: '/GestionarDesintoxicacionDigital' },
        { img: '/img/gestorhabitos/piel.png', nombre: 'Cuidado de la Piel', link: '/GestionarCuidadoPiel' },
        { img: '/img/gestorhabitos/alimentacion.png', nombre: 'Hidratación', link: '/GestionarHidratacion' },
    ],
    mental: [
        { img: '/img/gestorhabitos/ordenar.png', nombre: 'Ordenar Espacio Personal', link: '/GestionarOrdenarEspacio' },
        { img: '/img/gestorhabitos/leer.png', nombre: 'Lectura', link: '/GestionarLectura' },
        { img: '/img/gestorhabitos/meditacion.png', nombre: 'Meditación', link: '/GestionarMeditacion' },
        { img: '/img/gestorhabitos/escuchar-musica.png', nombre: 'Escuchar Musica Relajante', link: '/GestionarMusicaRelajante' },
    ]
};

async function mostrarHabitos(categoria) {
    const contenedor = document.getElementById('habitos-container');
    contenedor.innerHTML = '';

    let nombresActivos = [];
    try {
        const res = await fetch('/api/inicio/activeHabits');
        nombresActivos = await res.json(); // ["correr", "lectura", ...]
    } catch (err) {
        console.error('No se pudieron obtener los hábitos activos del usuario', err);
    }

    HABITOS[categoria].forEach(habito => {
        const nombreNormalizado = habito.nombre.trim().toLowerCase();
        if (nombresActivos.includes(nombreNormalizado)) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'caja';

        const option = document.createElement('div');
        option.className = 'option-1';
        option.innerHTML = `
            <img src="${habito.img}" alt="${habito.nombre}" />
            <span>${habito.nombre}</span>
        `;

        const boton = document.createElement('button');
        boton.className = 'plus-button';
        boton.textContent = '+';
        boton.onclick = (e) => {
            e.stopPropagation();
            location.href = habito.link;
        };

        wrapper.appendChild(option);
        wrapper.appendChild(boton);
        contenedor.appendChild(wrapper);
    });
}
