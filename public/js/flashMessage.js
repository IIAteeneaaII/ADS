const getCookie = (name) => {
const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
};

    const flashMessage = getCookie('flashMessage');
    const flashType = getCookie('flashType') || 'success';

    if (flashMessage) {
        Swal.fire({
            icon: flashType,
            title: flashType === 'error' ? 'Error' : 'Éxito',
            text: flashMessage,
            confirmButtonText: 'Aceptar'
        });

    // Borrar cookies para que no se repita el mensaje
    document.cookie = "flashMessage=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "flashType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}