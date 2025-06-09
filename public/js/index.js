const validator = new JustValidate('#formLogin');

validator
  .addField('#correo', [
    {
      rule: 'required',
      errorMessage: 'Este campo es obligatorio',
    },
    {
      rule: 'email',
      errorMessage: 'Ingresa un correo válido',
    },
  ])
  .addField('#contrasena', [
    {
      rule: 'required',
      errorMessage: 'Este campo es obligatorio',
    },
  ])
  .onSuccess((event) => {
    event.target.submit();
  });

const shark = document.querySelector(".shark-random");
const card = document.querySelector(".login-card");

if (!shark || !card) {
  console.error("No se encontró el tiburón o la tarjeta de login.");
} else {
  const maxX = card.clientWidth - shark.clientWidth;
  const maxY = card.clientHeight - shark.clientHeight;

  let sharkX = Math.random() * maxX;
  let sharkY = Math.random() * maxY;
  let moveX = 1;
  let moveY = 1;
  let movingRight = true;
  let movingDown = true;

  function moveShark() {
    if (movingRight) {
      sharkX += moveX;
      if (sharkX >= maxX) {
        movingRight = false;
        shark.style.transform = "scaleX(-1)";
      }
    } else {
      sharkX -= moveX;
      if (sharkX <= 0) {
        movingRight = true;
        shark.style.transform = "scaleX(1)";
      }
    }

    if (movingDown) {
      sharkY += moveY;
      if (sharkY >= maxY) {
        movingDown = false;
      }
    } else {
      sharkY -= moveY;
      if (sharkY <= 0) {
        movingDown = true;
      }
    }

    shark.style.left = `${sharkX}px`;
    shark.style.top = `${sharkY}px`;
  }

  setInterval(moveShark, 10);
}
// Mostrar/ocultar contraseña principal
document.getElementById("togglePassword").addEventListener("click", function () {
  const input = document.getElementById("contrasena");
  const isVisible = this.dataset.visible === "true";

  input.type = isVisible ? "password" : "text";
  this.className = isVisible ? "fa-solid fa-eye" : "fa-solid fa-eye-slash";
  this.dataset.visible = (!isVisible).toString();
});