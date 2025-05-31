const validator = new JustValidate('#formRegistro');

validator
  .addField('#userName', [
    {
      rule: 'required',
      errorMessage: 'El nombre de usuario es obligatorio',
    },
    {
      rule: 'minLength',
      value: 6,
      errorMessage: 'Debe tener al menos 6 caracteres',
    },
    {
      rule: 'maxLength',
      value: 20,
      errorMessage: 'No puede tener más de 20 caracteres',
    },
    {
      rule: 'customRegexp', // Comprueba que solo contenga letras y números, sin símbolos
      value: /^[a-zA-Z0-9]+$/,
      errorMessage: 'Solo se permiten letras y números (sin símbolos)',
    },
  ])
  .addField('#email', [
    {
      rule: 'required',
      errorMessage: 'El correo es obligatorio',
    },
    {
      rule: 'email',
      errorMessage: 'Ingresa un correo válido',
    },
  ])
  .addField('#password', [
    {
      rule: 'required',
      errorMessage: 'La contraseña es obligatoria',
    },
    {
      rule: 'password',
      errorMessage: 'Debe contener al menos una mayúscula, una minúscula, un número',
    },
    {
      rule: 'minLength',
      value: 8,
      errorMessage: 'Debe tener al menos 8 caracteres',
    },
  ])
  .addField('#confirmarContrasena', [
    {
      rule: 'required',
      errorMessage: 'Debes confirmar tu contraseña',
    },
    {
      validator: (value, fields) => {
        return value === fields['#password'].elem.value;
      },
      errorMessage: 'Las contraseñas no coinciden',
    },
  ])
  .addField('#terminosCheck', [
    {
      rule: 'required',
      errorMessage: 'Debes aceptar los términos y condiciones',
    },
  ])
  .addField('#codigo', [
    {
      rule: 'required',
      errorMessage: 'El código de verificación es obligatorio',
    },
  ])
  .onSuccess((event) => {
    event.target.submit(); // <- aquí habilitas el envío real
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
  const input = document.getElementById("password");
  const isVisible = this.dataset.visible === "true";

  input.type = isVisible ? "password" : "text";
  this.className = isVisible ? "fa-solid fa-eye" : "fa-solid fa-eye-slash";
  this.dataset.visible = (!isVisible).toString();
});
// Mostrar/ocultar contraseña de confirmación
document.getElementById("togglePassword2").addEventListener("click", function () {
  const input = document.getElementById("confirmarContrasena");
  const isVisible = this.dataset.visible === "true";

  input.type = isVisible ? "password" : "text";
  this.className = isVisible ? "fa-solid fa-eye" : "fa-solid fa-eye-slash";
  this.dataset.visible = (!isVisible).toString();
});

const btnCodigo = document.getElementById('btnCodigo');
const emailInput = document.getElementById('email');
const codigoError = document.getElementById('codigo-error');

function startResendTimer(seconds = 30) {
  let remaining = seconds;
  btnCodigo.disabled = true;
  btnCodigo.textContent = `Reenviar en ${remaining}s`;

  const timer = setInterval(() => {
    remaining--;
    btnCodigo.textContent = `Reenviar en ${remaining}s`;

    if (remaining <= 0) {
      clearInterval(timer);
      btnCodigo.disabled = false;
      btnCodigo.textContent = 'Reenviar código';
    }
  }, 1000);
}

btnCodigo.addEventListener('click', async () => {
  const email = emailInput.value.trim();

  if (!email) {
    codigoError.textContent = 'Ingresa tu email primero';
    codigoError.className = 'just-validate-error-label';
    codigoError.style.display = 'block';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    codigoError.textContent = 'Ingresa un email válido';
    codigoError.className = 'just-validate-error-label';
    codigoError.style.display = 'block';
    return;
  }

  codigoError.style.display = 'none';
  startResendTimer();
  try {
      const res = await fetch('/api/auth/auth-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

    } catch (error) {
      console.log('No funca')
    }
});