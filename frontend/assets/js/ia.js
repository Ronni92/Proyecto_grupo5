document.addEventListener("DOMContentLoaded", () => {
  const tareasContainer = document.getElementById("tareas-container");
  const fechaHoy = document.getElementById("fecha-hoy");

  // Obtener la fecha actual
  const fechaActual = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  fechaHoy.textContent = `📅 Hoy es ${fechaActual}`;

  // Simulación de tareas recomendadas por IA (CON TYPE)
  const tareasIA = [
    {
      type: "academic", // <-- Añadir propiedad type
      fecha: fechaActual,
      titulo: "Estudio de Matemáticas",
      descripcion: "Revisión de álgebra y cálculo para el examen.",
      horaInicio: "08:00 AM",
      horaFin: "10:00 AM",
      completado: false,
    },
    {
      type: "academic", // <-- Añadir propiedad type
      fecha: fechaActual,
      titulo: "Lectura de Física",
      descripcion: "Capítulo sobre dinámica y leyes de Newton.",
      horaInicio: "11:00 AM",
      horaFin: "12:00 PM",
      completado: false,
    },
    {
      type: "extracurricular", // <-- Añadir propiedad type
      fecha: fechaActual,
      titulo: "Ejercicio al aire libre",
      descripcion: "30 minutos de caminata rápida en el parque.",
      horaInicio: "06:00 PM",
      horaFin: "06:30 PM",
      completado: false,
    },
  ];

  // Cargar objetivos guardados por el usuario desde localStorage
  let objetivosUsuario = JSON.parse(localStorage.getItem("actividades")) || [];

  // Unir tareas de la IA con las del usuario
  const tareasTotales = [...tareasIA, ...objetivosUsuario];

  // Renderizar las tareas en tarjetas
  tareasTotales.forEach((tarea, index) => {
    const tareaCard = document.createElement("div");
    tareaCard.classList.add("task-card");

    // Añadir clase según tipo de actividad
    if (tarea.type === "academic") {
      tareaCard.classList.add("academic-activity");
    }

    // Estado de completado
    if (tarea.completado) {
      tareaCard.classList.add("completado");
    } else if (tareasIA.includes(tarea)) {
      tareaCard.classList.add("recomendado");
    } else {
      tareaCard.classList.add("pendiente");
    }

    tareaCard.innerHTML = `
      <h3>${tarea.titulo}</h3>
      <p><strong>Descripción:</strong> ${tarea.descripcion}</p>
      <p><strong>Horario:</strong> ${tarea.horaInicio || "No definido"} - ${
      tarea.horaFin || "No definido"
    }</p>
      ${tarea.type ? `<p><strong>Tipo:</strong> ${tarea.type}</p>` : ""}
      <button class="btn-completar" data-index="${index}">Completar</button>
    `;

    tareasContainer.appendChild(tareaCard);
  });

  // Marcar tareas como completadas
  document.querySelectorAll(".btn-completar").forEach(btn => {
    btn.addEventListener("click", (event) => {
        let tareaCard = event.target.parentElement;

        // Quitar clases antiguas y asignar nueva clase "completado"
        tareaCard.classList.remove("pendiente", "recomendado");
        tareaCard.classList.add("completado");

        // Remover el botón después de marcar como completado
        event.target.remove();
    });
});
});