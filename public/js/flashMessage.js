const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
};

const flashMessage = getCookie('flashMessage');
const flashType = getCookie('flashType') || 'success';
const rutasImagen = {
    error: '/img/sharki/enojado.png',
    success: '/img/sharki/feliz.png',
};

function obtenerRutaImagen(tipo) {
    return rutasImagen[tipo] || '/img/sharki/neutral.png';
}

if (flashMessage) {
    document.body.classList.add('no-scroll');  // Agregar solo cuando hay un mensaje

    Swal.fire({
        title: flashType === 'error' ? 'Error' : 'Éxito',
        imageUrl: obtenerRutaImagen(flashType),
        imageWidth: 250,
        // imageHeight: 250,
        text: flashMessage,
        confirmButtonText: 'Aceptar',
        customClass: {
            popup: 'swal-fullscreen animate-popup',
            confirmButton: 'btn-primary mt-4'
        },
    }).then(() => {
        document.body.classList.remove('no-scroll');
    });

    // Borrar cookies para que no se repita el mensaje
    document.cookie = "flashMessage=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "flashType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
