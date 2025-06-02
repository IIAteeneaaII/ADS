const habitsWithIcons = {
    estiramientos_matutinos: "estiramiento.png",
    correr: "correr.png",
    horas_de_dormir: "dormir.png",
    escuchar_musica_relajante: "escuchar-musica.png",
    hidratacion: "hidratacion.png",
    leer: "leer.png",
    ordenar_espacio_personal: "ordenar.png",
    cuidado_de_la_piel: "piel.png",
    saltar_la_cuerda: "saltar-la-cuerda.png",
    desconexion_digital: "sintelefono.png",
    meditacion: "meditacion.png"
};

function normalizeHabitName(name) {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // elimina acentos
        .toLowerCase()
        .replace(/ /g, "_"); // reemplaza espacios por guiones bajos
}

function getHabitIcon(habitTitle) {
    const habitName = habitTitle.split(":")[1]?.trim() || "default";
    const key = normalizeHabitName(habitName);
    return habitsWithIcons[key] || "personalizado.png";
}

module.exports = { getHabitIcon };
