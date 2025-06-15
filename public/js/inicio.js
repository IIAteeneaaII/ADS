const btnMenu = document.getElementById("btnMenu");
const menuLateral = document.getElementById("menuLateral");
const overlay = document.getElementById("overlay");
const contenedorGrafica = document.getElementById("contenedor-grafica");

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
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
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

  const botonTodoElDia = document.querySelector(".time-buttons button:nth-child(4)");
  if (botonTodoElDia) botonTodoElDia.click();
});

const seccionHabitos = document.getElementById("seccion-de-habitos");
let habitosGlobales = [];
let grafica;

function actualizarGraficaProgreso(habitos) {
  const total = habitos.length;
  const completados = habitos.filter(h => h.logs.status === "completed").length;
  const pendientes = total - completados;
  const porcentaje = Math.round((completados / total) * 100);

  const ctx = document.getElementById("graficaProgreso").getContext("2d");
  const centro = document.getElementById("porcentajeCentro");
  centro.textContent = `${porcentaje}%`;


  if (grafica) grafica.destroy();

  const colores = ["#60a9fa","#93c5fd"];

  grafica = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completado", "Pendiente"],
      datasets: [{
        data: [completados, pendientes],
        backgroundColor: colores,
        borderWidth: 2,
        borderColor: '#1e62af'
      }]
    },
    options: {
      cutout: "70%",
      animation: {
        animateRotate: true,
        animateScale: true
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw} hábitos`
          }
        }
      }
    }
  });

  // Leyenda personalizada
  const leyendaContenedor = document.getElementById("grafica-leyenda");
  leyendaContenedor.innerHTML = `
    <div class="item">
      <div class="cuadro-color" style="background-color: ${colores[0]}"></div>
      Completado (${completados})
    </div>
    <div class="item">
      <div class="cuadro-color" style="background-color: ${colores[1]}"></div>
      Pendiente (${pendientes})
    </div>
  `;
}



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
    habitosGlobales = habitos;

    if (habitos.length === 0) {
      seccionHabitos.innerHTML = `
        <img src="/img/sharki/sinHabitos.png" alt="Sin hábitos" class="img-fluid mb-3" style="max-width: 300px;">
        <p>No hay hábitos establecidos por el momento. Presiona “Crear nuevo hábito”.</p>
      `;
      contenedorGrafica.innerHTML = "";
    } else {
        contenedorGrafica.innerHTML = `
    <div class="habitos_titulo" class="fw-bold" >
      <h2>Hábitos completados</h2>
    </div>
    <div class="grafica-layout">
      <div class="grafica-container">
        <canvas id="graficaProgreso" width="150" height="150"></canvas>
        <div id="porcentajeCentro" class="grafica-porcentaje"></div>
      </div>
      <div id="grafica-leyenda" class="leyenda-grafica"></div>
    </div>
    <div class="separator" style="margin: 1.75rem auto; width: 100%;"></div>
  `;

      habitos.forEach((habito) => {
        const habitContainer = document.createElement("div");
        habitContainer.className = "d-flex align-items-center mb-3 px-2";

        const habitIcon = document.createElement("img");
        habitIcon.src = habito.icon;
        habitIcon.alt = "icono";
        habitIcon.classList.add("habit-icon");

        const habitCard = document.createElement("div");
        habitCard.className = "habit-card";

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
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="habit-info">
              <span class="fw-bold">${habito.name}</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="habit-value-badge">${habito.fieldValues?.value ?? ""} ${habito.fieldValues?.unit ?? ""}</span>
              <div class="switch-container"></div>
            </div>
          </div>
        `;
        habitCard.innerHTML = cardContent;
        habitCard.querySelector(".switch-container").appendChild(toggleLabel);

        toggleInput.addEventListener("change", async function (e) {
          e.stopPropagation();
          const status = toggleInput.checked ? "completed" : "pending";

          Swal.fire({
            title: "Cargando...",
            text: "Guardando el estado del hábito en la nube",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
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

            setTimeout(() => {
              Swal.close();
              if (!res.ok) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: result.error || "Hubo un error al actualizar el hábito",
                });
              } else {
                habito.logs.status = status;
                actualizarGraficaProgreso(habitosGlobales);

                Swal.fire({
                  icon: "success",
                  title: "¡Éxito!",
                  text: "El hábito se actualizó correctamente",
                  timer: 1500,
                  showConfirmButton: false,
                });
              }
            }, 1000);
          } catch (error) {
            console.error("Error actualizando el estado del hábito:", error);
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

      actualizarGraficaProgreso(habitos);
    }
  } catch (error) {
    console.error("Error cargando hábitos:", error);
    seccionHabitos.innerHTML = `
        <img src="/img/sharki/triste.png" class="img-fluid mb-3" style="max-width: 300px;">
        <p class="fw-bold">Ocurrió un error, inténtalo más tarde.</p>
      `;
  }
}

window.addEventListener("load", cargarHabitos);

document.getElementById("confirmarLogout").addEventListener("click", () => {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  });
  localStorage.removeItem("token");
  window.location.href = "/";
});
