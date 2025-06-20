document.addEventListener("DOMContentLoaded", function() {
    const items = document.querySelectorAll('.notification-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('read');
            }
        });
    }, { threshold: 0.1 });

    items.forEach(item => observer.observe(item));
});