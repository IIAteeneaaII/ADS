const HABITOS = {
    movimiento: [
        { img: '/img/gestorhabitos/estiramiento.png', nombre: 'Estiramientos matutinos', link: '/estiramientos' },
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
    contenedor.innerHTML = ''; // Limpia hábitos anteriores

    HABITOS[categoria].forEach(habito => {
        const div = document.createElement('div');
        div.className = 'option-1';
        div.innerHTML = `
            <img src="${habito.img}" alt="${habito.nombre}" />
            <span>${habito.nombre}</span>
            <div style="padding-left: 10rem; background-color:#009394;">
                <button onclick="event.stopPropagation(); location.href='${habito.link}'" class="plus-button">+</button>
            </div>
        `;
        contenedor.appendChild(div);
    });
}
