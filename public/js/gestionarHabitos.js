const HABITOS = {
    movimiento: [
        { img: '../img/gestorhabitos/estiramiento.png', nombre: 'Estiramientos matutinos', link: '/estiramientos' },
        { img: '../img/gestorhabitos/correr.png', nombre: 'Correr', link: 'movimiento2.html' },
        { img: '../img/gestorhabitos/bici.png', nombre: 'Andar en bicicleta', link: 'movimiento3.html' },
        { img: '../img/gestorhabitos/saltar-la-cuerda.png', nombre: 'Saltar la cuerda', link: 'movimiento4.html' }
    ],
    bienestar: [
        { img: '../img/gestorhabitos/respiro.png', nombre: 'Respiración consciente', link: '/bienestar1' },
        { img: '../img/gestorhabitos/baño.png', nombre: 'Baño relajante', link: '/bienestar2' }
        // Agrega más si es necesario
    ],
    mental: [
        { img: '../img/gestorhabitos/lectura.png', nombre: 'Leer', link: '/mental1' },
        { img: '../img/gestorhabitos/meditacion.png', nombre: 'Meditar', link: '/mental2' }
        // Agrega más si es necesario
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
            <button onclick="event.stopPropagation(); location.href='${habito.link}'" class="plus-button">+</button>
        `;
        contenedor.appendChild(div);
    });
}
