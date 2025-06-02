let hasReachedLastSlide = false;

const swiper = new Swiper('.swiper', {
  loop: false,
  grabCursor: true,
  spaceBetween: 80,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 1 },
    992: { slidesPerView: 1 }
  },
  on: {
    slideChangeTransitionEnd: function () {
      const continuarBtn = document.getElementById('continuarBtn');
      const totalSlides = 5; // número real, sin clones

      // Mostrar botón si es el último slide real
      if (this.realIndex === totalSlides - 1 && !hasReachedLastSlide) {
        hasReachedLastSlide = true;
        continuarBtn.classList.add('show');
      }

      // Animación de la tarjeta activa
      document.querySelectorAll('.card-item').forEach(card => {
        card.classList.remove('fade-in');
      });

      const activeCard = document.querySelector('.swiper-slide-active .card-item');
      if (activeCard) {
        void activeCard.offsetWidth;
        activeCard.classList.add('fade-in');
      }
    }
  }
});

// Al cargar la página
window.addEventListener('load', () => {
  const firstCard = document.querySelector('.swiper-slide-active .card-item');
  if (firstCard) {
    void firstCard.offsetWidth;
    firstCard.classList.add('fade-in');
  }
});
