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
  ]);

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
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("contrasena");
const errorMsg = document.getElementById("errorMsg");
const form = document.getElementById("formLogin");

togglePassword.addEventListener("click", () => {
  const isVisible = togglePassword.getAttribute("data-visible") === "true";
  passwordInput.type = isVisible ? "password" : "text";
  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
  togglePassword.setAttribute("data-visible", !isVisible);
});

form.addEventListener("submit", (e) => {
  e.preventDefault(); // evita el envío del formulario
  if (passwordInput.value.trim() === "") {
    errorMsg.style.display = "block";
  } else{
    event.target.submit();
  }
});