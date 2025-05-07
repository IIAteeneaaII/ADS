const HABITOS = {
    movimiento: [
        { img: '/img/gestorhabitos/estiramiento.png', nombre: 'Estiramientos matutinos', link: '/gestionarestiramientos' },
        { img: '/img/gestorhabitos/correr.png', nombre: 'Correr', link: '/Correr' },
        { img: '/img/gestorhabitos/bici.png', nombre: 'Andar en bicicleta', link: '/AndarEnBicicleta' },
        { img: '/img/gestorhabitos/saltar-la-cuerda.png', nombre: 'Saltar la cuerda', link: '/SaltarLaCuerda' }
    ],
    bienestar: [
        { img: '/img/gestorhabitos/dormir.png', nombre: 'Horas de sueño', link: '/sueño' },
        { img: '/img/gestorhabitos/sintelefono.png', nombre: 'Desintoxicación Digital', link: '/sueño' },
        { img: '/img/gestorhabitos/piel.png', nombre: 'Cuidado de la Piel', link: '/sueño' },
        { img: '/img/gestorhabitos/alimentacion.png', nombre: 'Alimentación', link: '/sueño' },
    ],
    mental: [
        { img: '/img/gestorhabitos/ordenar.png', nombre: 'Ordenar Espacio Personal', link: '/ordenarEspacio' },
        { img: '/img/gestorhabitos/leer.png', nombre: 'Lectura', link: '/Lectura' },
        { img: '/img/gestorhabitos/meditacion.png', nombre: 'Meditación', link: '/Meditacion' },
        { img: '/img/gestorhabitos/escuchar-musica.png', nombre: 'Escuchar Musica Relajante', link: '/EscucharMusicaRelajante' },
    ]
};

function mostrarHabitos(categoria) {
    const contenedor = document.getElementById('habitos-container');
    contenedor.innerHTML = '';

    HABITOS[categoria].forEach(habito => {
        // Contenedor general que envuelve la tarjeta + botón
        const wrapper = document.createElement('div');
        wrapper.className = 'caja';

        // La tarjeta del hábito
        const option = document.createElement('div');
        option.className = 'option-1';
        option.innerHTML = `
            <img src="${habito.img}" alt="${habito.nombre}" />
            <span>${habito.nombre}</span>
        `;

        // El botón fuera del div.option-1
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

