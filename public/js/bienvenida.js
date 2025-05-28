const swiper = new Swiper('.swiper', {
  loop: true,
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
    0: {
      slidesPerView: 1
    },
    768: {
      slidesPerView: 1
    },
    992: {
      slidesPerView: 1
    }
  }
});
