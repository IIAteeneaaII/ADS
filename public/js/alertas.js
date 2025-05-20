function mostrarAlerta({ title, text, imageUrl, redirectUrl, btnText }) {
    document.body.classList.add('no-scroll');
    console.log('Lanzando alerta...');

    Swal.fire({
        title: title,
        text: text,
        imageUrl: imageUrl,
        imageWidth: 250,
        imageHeight: 250,
        background: '#ffffff',
        showConfirmButton: true,
        confirmButtonText: btnText,
        customClass: {
            popup: 'swal-fullscreen animate-popup',
            confirmButton: 'btn-primary mt-4'
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: true,
        focusConfirm: false
    }).then((result) => {
        console.log('SweetAlert cerrado con:', result);
        document.body.classList.remove('no-scroll');
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    });
}
