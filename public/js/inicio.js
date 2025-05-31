const btnMenu = document.getElementById("btnMenu");
const menuLateral = document.getElementById("menuLateral");
const overlay = document.getElementById("overlay");

btnMenu.addEventListener("click", () => {
  menuLateral.classList.add("active");
  overlay.classList.add("active");
});

function cerrarMenu() {
  menuLateral.classList.remove("active");
  overlay.classList.remove("active");
}
overlay.addEventListener("click", cerrarMenu);
const logoutModal = document.getElementById("logoutModal");

logoutModal.addEventListener("hidden.bs.modal", () => {
  document.body.focus();
});

document.addEventListener("DOMContentLoaded", () => {
  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const hoy = new Date();
  const diaTexto = dias[hoy.getDay()];
  const numero = hoy.getDate();

  const diaSemana = document.getElementById("diaSemana");
  const numeroDia = document.getElementById("numeroDia");

  if (diaSemana && numeroDia) {
    diaSemana.textContent = diaTexto;
    numeroDia.textContent = numero;
  } else {
    console.warn(
      "No se encontraron los elementos con IDs 'diaSemana' o 'numeroDia'"
    );
  }

  const botonTodoElDia = document.querySelector(
    ".time-buttons button:nth-child(4)"
  );
  if (botonTodoElDia) {
    botonTodoElDia.click();
  }
});

const seccionHabitos = document.getElementById("seccion-de-habitos");

async function cargarHabitos() {
  const today = new Date();
  today.setHours(1, 0, 0, 0);
  seccionHabitos.innerHTML = "";

  try {
    const response = await fetch("/api/inicio/principalScr", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const habitos = await response.json();

    if (habitos.length === 0) {
      seccionHabitos.innerHTML = `
        <img src="/img/sharki/sinHabitos.png" alt="Sin hábitos" class="img-fluid mb-3" style="max-width: 300px;">
        <p>Hmm, no hay ningún hábito establecido por el momento. Presiona el botón “Crear nuevo hábito” para crear tu primer hábito y comenzar a cumplir tus objetivos.</p>
      `;
    } else {
      habitos.forEach((habito) => {
        const habitContainer = document.createElement("div");
        habitContainer.className = "d-flex align-items-center mb-3 px-2";

        const habitIcon = document.createElement("img");
        habitIcon.src = habito.icon;
        habitIcon.alt = "icono";
        habitIcon.classList.add("habit-icon");

        const habitCard = document.createElement("div");
        habitCard.className =
          "habit-card";

        const toggleLabel = document.createElement("label");
        toggleLabel.className = "switch";

        const toggleInput = document.createElement("input");
        toggleInput.type = "checkbox";
        toggleInput.checked = habito.logs.status === "completed";

        const toggleSlider = document.createElement("span");
        toggleSlider.className = "slider round";

        toggleLabel.appendChild(toggleInput);
        toggleLabel.appendChild(toggleSlider);

        const cardContent = `
          <div class="d-flex flex-column">
            <span class="fw-bold">${habito.name}</span>
          </div>
          <div class="d-flex align-items-center">
            <span class="habit-value-badge">
              ${habito.fieldValues?.value ?? ""} ${
          habito.fieldValues?.unit ?? ""
        }
            </span>
          </div>
        `;

        habitCard.innerHTML = cardContent;
        habitCard
          .querySelector(".d-flex.align-items-center:last-child")
          .appendChild(toggleLabel);

        toggleInput.addEventListener("change", async function (e) {
          e.stopPropagation();
          const status = toggleInput.checked ? "completed" : "pending";

          // Mostrar animación de carga
          Swal.fire({
            title: "Cargando...",
            text: "Guardando el estado del hábito en la nube",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          try {
            const res = await fetch("/api/inicio/actualizarlogs", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                userHabitId: habito.id,
                date: today,
                status: status,
              }),
            });

            const result = await res.json();

            // Esperar 1.5 segundos para simular carga
            setTimeout(() => {
              Swal.close(); // Cierra la alerta de carga

              if (!res.ok) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: result.error || "Hubo un error al actualizar el hábito",
                });
              } else {
                Swal.fire({
                  icon: "success",
                  title: "¡Éxito!",
                  text: "El hábito se actualizó correctamente",
                  timer: 1000,
                  showConfirmButton: false,
                });
              }
            }, 1000);
          } catch (error) {
            console.error("Error actualizando el estado del hábito:", error);

            // También simula un pequeño retraso en caso de error
            setTimeout(() => {
              Swal.close();
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error de red o del servidor al actualizar el hábito",
              });
            }, 1000);
          }
        });

        habitContainer.appendChild(habitIcon);
        habitContainer.appendChild(habitCard);
        seccionHabitos.appendChild(habitContainer);
      });
    }
  } catch (error) {
    console.error("Error cargando hábitos:", error);
    seccionHabitos.innerHTML = "<p>Error al cargar los hábitos.</p>";
  }
}

// Llamar a la función de carga de hábitos cuando la página se carga
window.addEventListener("load", cargarHabitos);

//  Logout: borrar cookies y token, redirigir al login
document.getElementById("confirmarLogout").addEventListener("click", () => {
  // Borra todas las cookies accesibles desde JavaScript
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  });
  // Elimina el token JWT del almacenamiento local
  localStorage.removeItem("token");
  window.location.href = "/";
});
