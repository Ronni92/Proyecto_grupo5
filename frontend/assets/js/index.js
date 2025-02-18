const sideMenu = document.querySelector("aside");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const darkMode = document.querySelector(".dark-mode");

// =============================
// ✅ MODO OSCURO ✅
// =============================
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode-variables");
  darkMode.querySelector("span:nth-child(1)").classList.remove("active");
  darkMode.querySelector("span:nth-child(2)").classList.add("active");
} else {
  document.body.classList.remove("dark-mode-variables");
  darkMode.querySelector("span:nth-child(1)").classList.add("active");
  darkMode.querySelector("span:nth-child(2)").classList.remove("active");
}

menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

document.body.classList.add("loading"); // Aseguramos que loading se aplica primero

// ✅ Aplicar Modo Oscuro antes de mostrar el contenido
const setDarkMode = () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode-variables");
    darkMode.querySelector("span:nth-child(1)").classList.remove("active");
    darkMode.querySelector("span:nth-child(2)").classList.add("active");
  } else {
    document.body.classList.remove("dark-mode-variables");
    darkMode.querySelector("span:nth-child(1)").classList.add("active");
    darkMode.querySelector("span:nth-child(2)").classList.remove("active");
  }
};
setDarkMode();

// ✅ Eliminar la clase "loading" cuando todo esté listo
window.onload = () => {
  document.body.classList.remove("loading");
};

// ✅ Gestionar el cambio de modo oscuro cuando el usuario hace clic
darkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode-variables");
  darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
  darkMode.querySelector("span:nth-child(2)").classList.toggle("active");

  // Guardamos el estado en localStorage
  if (document.body.classList.contains("dark-mode-variables")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
});

// =============================
// ✅ CARGAR USERNAME Y FOTO DE PERFIL EN TODAS LAS PÁGINAS ✅
// =============================
document.addEventListener("DOMContentLoaded", () => {
  let username = localStorage.getItem("username");
  let userPhoto = localStorage.getItem("user_photo"); // Foto guardada en localStorage

  // ✅ Mostrar nombre de usuario en Right Section
  const usernameDisplay = document.getElementById("username-display");
  if (username && usernameDisplay) {
    usernameDisplay.textContent = username;
  }

  // ✅ Mostrar foto de perfil en Right Section
  actualizarFotoPerfil(userPhoto);
});

// =============================
// ✅ FUNCIÓN PARA ACTUALIZAR FOTO EN TODAS LAS INSTANCIAS ✅
// =============================
function actualizarFotoPerfil(userPhoto) {
  if (!userPhoto) {
    userPhoto = "assets/images/default-profile.jpg"; // Imagen por defecto
  }

  // Buscar y actualizar todas las instancias de `#user-photo`
  document.querySelectorAll("#user-photo").forEach((imgElement) => {
    imgElement.src = userPhoto;
  });
}

// =============================
// ✅ BLOQUEAR HORAS DE SUEÑO (23:00 - 5:00) ✅
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const scheduleBody = document.getElementById("schedule-body");

  if (scheduleBody) {
    for (let i = 23; i < 24; i++) {
      // Bloquear de 23:00 a 0:00
      bloquearHorasDeSueño(i);
    }
    for (let i = 0; i < 5; i++) {
      // Bloquear de 0:00 a 5:00
      bloquearHorasDeSueño(i);
    }
  }
});

function bloquearHorasDeSueño(hour) {
  for (let j = 0; j < 7; j++) {
    // 7 días de la semana
    let cell = document.querySelector(
      `td[data-day="${j}"][data-hour="${hour}"]`
    );
    if (!cell) continue;

    cell.classList.add("sleep-hours");
    cell.textContent = "Horas de sueño";
  }
}

// =============================
// ✅ GUARDAR PREFERENCIAS DE HORARIOS ✅
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const guardarPreferenciasBtn = document.getElementById(
    "guardar-preferencias"
  );

  if (guardarPreferenciasBtn) {
    guardarPreferenciasBtn.addEventListener("click", () => {
      const horaInicio = document.getElementById("hora-inicio").value;
      const horaFin = document.getElementById("hora-fin").value;
      const duracionPausas = document.getElementById("pausas").value;

      if (!horaInicio || !horaFin || !duracionPausas) {
        alert("❌ Por favor, completa todos los campos.");
        return;
      }

      const inicio = parseInt(horaInicio.split(":")[0]);
      const fin = parseInt(horaFin.split(":")[0]);

      if (fin <= inicio) {
        alert("⚠️ La hora de fin debe ser mayor que la de inicio.");
        return;
      }

      localStorage.setItem(
        "preferencias_horario",
        JSON.stringify({
          inicio: inicio,
          fin: fin,
          pausas: parseInt(duracionPausas),
        })
      );

      alert("✅ Preferencias guardadas correctamente.");
    });
  }
});

// =============================
// ✅ AGREGAR ACTIVIDADES RECOMENDADAS ✅
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const addRecommendedBtn = document.getElementById("add-recommended");

  if (addRecommendedBtn) {
    addRecommendedBtn.addEventListener("click", () => {
      const preferencias = localStorage.getItem("preferencias_horario");

      if (!preferencias) {
        alert("⚠️ No hay actividades recomendadas guardadas.");
        return;
      }

      const { inicio, fin } = JSON.parse(preferencias);
      const selectedDays = obtenerDiasSeleccionados();

      if (selectedDays.length === 0) {
        alert("⚠️ Selecciona al menos un día.");
        return;
      }

      selectedDays.forEach((day) => {
        for (let i = inicio; i < fin; i++) {
          let cell = document.querySelector(
            `td[data-day="${day}"][data-hour="${i}"]`
          );

          if (!cell) continue;

          if (
            cell.classList.contains("academic") ||
            cell.classList.contains("extracurricular")
          ) {
            alert(
              `⚠️ Hay una actividad ocupando este horario (${cell.textContent}).`
            );
          } else {
            cell.classList.add("preferred");
            cell.textContent = "Recomendado";
          }
        }
      });

      alert("✅ Actividades recomendadas agregadas con éxito.");
    });
  }
});

// =============================
// 📤 SUBIR FOTO DE PERFIL Y GUARDAR EN LOCALSTORAGE 📤
// =============================
async function uploadUserPhoto(userId) {
  const fileInput = document.getElementById("upload-photo");
  const mensaje = document.getElementById("photo-message");

  if (!fileInput.files.length) {
    mostrarMensajeError(mensaje, "❌ Selecciona una imagen antes de subir.");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("user_id", userId);

  try {
    const response = await fetch("http://localhost:8000/update-photo/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.image) {
      // ✅ Guardar imagen en localStorage
      const imageSrc = `data:image/png;base64,${data.image}`;
      localStorage.setItem("user_photo", imageSrc);

      // ✅ Actualizar todas las instancias de la foto de perfil
      actualizarFotoPerfil(imageSrc);

      mostrarMensajeExito(mensaje, "✅ Foto de perfil actualizada.");
    } else {
      mostrarMensajeError(mensaje, "❌ Error al subir la foto.");
    }
  } catch (error) {
    console.error("❌ Error al subir la foto:", error);
    mostrarMensajeError(mensaje, "❌ Hubo un error al actualizar la foto.");
  }
}

// =============================
// ✅ FUNCIONES PARA MOSTRAR MENSAJES ✅
// =============================
function mostrarMensajeExito(elemento, mensaje) {
  if (!elemento) return;
  elemento.textContent = mensaje;
  elemento.style.color = "green";
  elemento.style.fontWeight = "bold";
}

function mostrarMensajeError(elemento, mensaje) {
  if (!elemento) return;
  elemento.textContent = mensaje;
  elemento.style.color = "red";
  elemento.style.fontWeight = "bold";
}

// =============================
// ✅ GUARDAR PREFERENCIAS DE HORARIOS ✅
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const guardarPreferenciasBtn = document.getElementById(
    "guardar-preferencias"
  );

  if (guardarPreferenciasBtn) {
    guardarPreferenciasBtn.addEventListener("click", () => {
      const horaInicio = document.getElementById("hora-inicio").value;
      const horaFin = document.getElementById("hora-fin").value;
      const duracionPausas = document.getElementById("pausas").value;

      if (!horaInicio || !horaFin || !duracionPausas) {
        alert("❌ Por favor, completa todos los campos.");
        return;
      }

      // Convertir las horas a valores enteros
      const inicio = parseInt(horaInicio.split(":")[0]);
      const fin = parseInt(horaFin.split(":")[0]);

      if (fin <= inicio) {
        alert("⚠️ La hora de fin debe ser mayor que la de inicio.");
        return;
      }

      // Guardar en `localStorage`
      localStorage.setItem(
        "preferencias_horario",
        JSON.stringify({
          inicio: inicio,
          fin: fin,
          pausas: parseInt(duracionPausas),
        })
      );

      alert("✅ Preferencias guardadas correctamente.");
    });
  }
});

// =============================
// ✅ Mapeo de días (Número <-> Nombre)
// =============================
const daysMap = {
  0: "Lunes",
  1: "Martes",
  2: "Miércoles",
  3: "Jueves",
  4: "Viernes",
  5: "Sábado",
  6: "Domingo",
};

const reverseDaysMap = Object.fromEntries(
  Object.entries(daysMap).map(([key, value]) => [value, parseInt(key)])
);

// =============================
// ✅ CARGAR HORARIO DESDE LOCALSTORAGE O MONGODB ✅
// =============================

async function cargarHorarios() {
  let userId = localStorage.getItem("user_id");
  if (!userId) return;

  let scheduleData = JSON.parse(localStorage.getItem("user_schedule"));

  if (!scheduleData || Object.keys(scheduleData).length === 0) {
    try {
      const response = await fetch(
        `http://localhost:8000/get-schedule/${userId}`
      );
      scheduleData = await response.json();

      if (
        !scheduleData ||
        !scheduleData.schedule ||
        scheduleData.schedule.length === 0
      ) {
        console.warn("⚠️ No hay datos en el horario guardado.");
        return;
      }

      localStorage.setItem("user_schedule", JSON.stringify(scheduleData));
    } catch (error) {
      console.error("❌ Error al cargar el horario:", error);
      alert(
        "❌ Error al cargar el horario. Revisa la conexión con el servidor."
      );
      return;
    }
  }

  console.log("📥 Datos cargados desde LocalStorage o MongoDB:", scheduleData);

  // ✅ Extraer el array de horarios
  let scheduleArray = scheduleData.schedule;
  if (!Array.isArray(scheduleArray)) {
    console.error("❌ Error: scheduleData.schedule no es un array.");
    return;
  }

  // ✅ Limpiar la tabla antes de repintar
  document
    .querySelectorAll("td.academic, td.extracurricular, td.preferred")
    .forEach((cell) => {
      cell.classList.remove("academic", "extracurricular", "preferred");
      cell.textContent = "";
    });

  // ✅ Pintar actividades en la tabla
  scheduleArray.forEach((item) => {
    let cell = document.querySelector(
      `td[data-day="${item.day}"][data-hour="${item.hour}"]`
    );
    if (cell) {
      if (item.type === "academic") {
        cell.classList.add("academic");
        cell.textContent = item.subject || "Materia";
      } else if (item.type === "extracurricular") {
        cell.classList.add("extracurricular");
        cell.textContent = "Actividad";
      } else if (item.type === "preferred") {
        cell.classList.add("preferred");
        cell.textContent = "Disponible";
      }
    } else {
      console.warn(
        `⚠️ No se encontró la celda para day=${item.day}, hour=${item.hour}`
      );
    }
  });

  console.log("✅ Horario actualizado en la tabla.");
}

// ✅ Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  generarTablaHorarios(); // 🔹 Generar la tabla antes de cargar los datos
  setTimeout(() => {
    cargarHorarios().then(actualizarResumenDia);
  }, 500);
});

// =============================
// ✅ GENERAR TABLA DE HORARIOS ✅
// =============================

function generarTablaHorarios() {
  const scheduleBody = document.getElementById("schedule-body");
  if (!scheduleBody) {
    console.error("❌ No se encontró el elemento #schedule-body en el HTML.");
    return;
  }

  scheduleBody.innerHTML = ""; // Limpiar antes de regenerar

  for (let i = 6; i <= 22; i++) {
    // Horas de 6 AM a 10 PM
    let row = document.createElement("tr");

    // Columna de la hora
    let hourCell = document.createElement("td");
    hourCell.textContent = `${i}:00 - ${i + 1}:00`;
    row.appendChild(hourCell);

    // Crear celdas para cada día (Lunes a Domingo)
    for (let j = 0; j < 7; j++) {
      let cell = document.createElement("td");
      cell.dataset.day = j;
      cell.dataset.hour = i;
      row.appendChild(cell);
    }

    scheduleBody.appendChild(row);
  }
}

// =============================
// ✅ BLOQUEAR HORAS DE SUEÑO ✅
// =============================

function bloquearHorasDeSueño() {
  for (let j = 0; j < 7; j++) {
    for (let i = 23; i <= 24; i++) {
      // Bloquear de 23:00 a 5:00
      let cell = document.querySelector(
        `td[data-day="${j}"][data-hour="${i}"]`
      );
      if (cell) {
        cell.classList.add("sleep-hours");
        cell.textContent = "Horas de sueño";
      }
    }
    for (let i = 0; i < 5; i++) {
      // Bloquear de 0:00 a 5:00
      let cell = document.querySelector(
        `td[data-day="${j}"][data-hour="${i}"]`
      );
      if (cell) {
        cell.classList.add("sleep-hours");
        cell.textContent = "Horas de sueño";
      }
    }
  }
}

// =============================
// ✅ GUARDAR HORARIO EN LOCALSTORAGE Y MONGO ✅
// =============================
async function guardarHorario() {
  let userId = localStorage.getItem("user_id");
  if (!userId) {
    alert("❌ No se ha iniciado sesión.");
    return;
  }

  const actividadesAcademicas = [];
  const actividadesExtracurriculares = [];
  const horasDisponibles = [];

  document
    .querySelectorAll("td.academic, td.extracurricular, td.preferred")
    .forEach((cell) => {
      const entry = {
        day: parseInt(cell.dataset.day),
        hour: parseInt(cell.dataset.hour),
        type: cell.classList.contains("academic")
          ? "academic"
          : cell.classList.contains("extracurricular")
          ? "extracurricular"
          : "preferred",
      };

      if (cell.classList.contains("academic")) {
        entry.subject = cell.textContent || "Materia";
        actividadesAcademicas.push(entry);
      } else if (cell.classList.contains("extracurricular")) {
        actividadesExtracurriculares.push(entry);
      } else {
        horasDisponibles.push(entry);
      }
    });

  const scheduleData = {
    user_id: parseInt(userId),
    schedule: [
      ...actividadesAcademicas,
      ...actividadesExtracurriculares,
      ...horasDisponibles,
    ],
  };

  // ✅ Guardar en LocalStorage antes de enviarlo a MongoDB
  localStorage.setItem("user_schedule", JSON.stringify(scheduleData));

  console.log(
    "📤 Enviando JSON al backend:",
    JSON.stringify(scheduleData, null, 2)
  );

  try {
    const response = await fetch("http://localhost:8000/save-schedule/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scheduleData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Horario guardado correctamente.");
    } else {
      alert("❌ Error al guardar el horario: " + JSON.stringify(data.detail));
    }
  } catch (error) {
    console.error("❌ Error al guardar el horario:", error);
    alert(
      "❌ Error al guardar el horario. Revisa la conexión con el servidor."
    );
  }
}

// ✅ Asignar el evento al botón de guardar
document
  .getElementById("save-schedule")
  .addEventListener("click", guardarHorario);

// =============================
// ✅ ESTILOS CSS ✅
// =============================
const style = document.createElement("style");
style.innerHTML = `
  .sleep-hours {
      background-color: #444 !important;
      color: white;
      font-weight: bold;
      text-align: center;
  }

  .preferred {
      background-color: #1B9C85 !important;
      color: white;
      font-weight: bold;
      text-align: center;
  }
`;
document.head.appendChild(style);

// =============================
// ✅ APLICAR PREFERENCIAS DE HORARIOS EN EL HORARIO ✅
// =============================
function aplicarPreferenciasHorario() {
  const preferencias = localStorage.getItem("preferencias_horario");

  if (!preferencias) {
    console.warn("⚠️ No hay preferencias de horario guardadas.");
    return;
  }

  const { inicio, fin } = JSON.parse(preferencias);

  // Iterar sobre las horas y marcarlas en la tabla
  for (let i = inicio; i < fin; i++) {
    for (let j = 0; j < 7; j++) {
      // 7 días de la semana
      let cell = document.querySelector(
        `td[data-day="${j}"][data-hour="${i}"]`
      );

      if (!cell) continue;

      // Evitar sobrescribir actividades académicas y extracurriculares
      if (
        !cell.classList.contains("academic") &&
        !cell.classList.contains("extracurricular")
      ) {
        cell.classList.add("preferred");
        cell.textContent = "Disponible";
      }
    }
  }

  console.log("✅ Preferencias de horario aplicadas correctamente.");
}

// ✅ Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", aplicarPreferenciasHorario);

// =============================
// ✅ ACTUALIZAR TARJETA "RESUMEN DEL DÍA" ✅
// =============================
function actualizarResumenDia() {
  let scheduleData = JSON.parse(localStorage.getItem("user_schedule"));

  if (!scheduleData || !scheduleData.schedule) {
    console.warn("⚠️ No hay datos guardados en el horario.");
    return;
  }

  let totalHoras = 0;
  let horasAcademicas = 0;
  let horasExtracurriculares = 0;
  let horasDisponibles = 0;

  scheduleData.schedule.forEach((item) => {
    totalHoras++;
    if (item.type === "academic") {
      horasAcademicas++;
    } else if (item.type === "extracurricular") {
      horasExtracurriculares++;
    } else if (item.type === "preferred") {
      horasDisponibles++;
    }
  });

  // ✅ Actualizar la tarjeta en el HTML
  document.getElementById("total-horas").textContent = totalHoras;
  document.getElementById("academic-hours").textContent = horasAcademicas;
  document.getElementById("extracurricular-hours").textContent =
    horasExtracurriculares;

  // 🟢 Agregar las horas disponibles
  let horasDisponiblesElement = document.getElementById("available-hours");
  if (horasDisponiblesElement) {
    horasDisponiblesElement.textContent = horasDisponibles;
  } else {
    // Si no existe, lo agregamos al HTML
    let summarySection = document.querySelector(".options");
    let newElement = document.createElement("p");
    newElement.innerHTML = `<strong>Horas Disponibles:</strong> <span id="available-hours">${horasDisponibles}</span> hrs 🟢`;
    summarySection.appendChild(newElement);
  }

  console.log("✅ Resumen del día actualizado.");
}

// ✅ Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", actualizarResumenDia);

// =============================
// 📊 CARGAR Y ACTUALIZAR GRÁFICOS 📊
// =============================

document.addEventListener("DOMContentLoaded", async () => {
  actualizarFecha();
  actualizarEstadoHorario();
  await actualizarGraficoDistribucion();
});

// =============================
// 📆 ACTUALIZAR FECHA ACTUAL
// =============================

function actualizarFecha() {
  const fechaElement = document.getElementById("fecha-actual");
  if (fechaElement) {
    fechaElement.textContent = new Date().toLocaleDateString();
  }
}

// =============================
// 📊 ACTUALIZAR GRÁFICO DE DISTRIBUCIÓN DEL TIEMPO (POR DÍA ACTUAL)
// =============================

let distribucionChart = null;

async function actualizarGraficoDistribucion() {
  let userId = localStorage.getItem("user_id");
  if (!userId) return;

  try {
    const response = await fetch(
      `http://localhost:8000/get-schedule/${userId}`
    );
    const scheduleData = await response.json();

    if (!scheduleData || !scheduleData.schedule) {
      console.warn("⚠️ No hay datos en la base de datos.");
      return;
    }

    const diaActual = new Date().getDay() - 1; // Ajustar el índice para que Lunes = 0
    if (diaActual < 0) return; // Evitar errores si hoy es Domingo

    let horasAcademicas = 0;
    let horasExtracurriculares = 0;
    let horasDescanso = 24; // Empezamos con 24 horas y vamos restando las ocupadas
    let horasRecomendadas = 0;

    // 📌 Contar actividades del día actual
    for (const actividad of scheduleData.schedule) {
      if (actividad.day !== diaActual) continue;

      if (actividad.type === "academic") {
        horasAcademicas++;
      } else if (actividad.type === "extracurricular") {
        horasExtracurriculares++;
      } else if (actividad.type === "preferred") {
        horasRecomendadas++;
      }

      horasDescanso--; // Restamos la hora ocupada
    }

    const ctxDistribucion = document
      .getElementById("grafico-tiempo")
      ?.getContext("2d");
    if (ctxDistribucion) {
      if (distribucionChart !== null) {
        distribucionChart.destroy(); // Destruir gráfico previo para evitar duplicados
      }

      distribucionChart = new Chart(ctxDistribucion, {
        type: "pie",
        data: {
          labels: [
            "Académicas",
            "Extracurriculares",
            "Descanso",
            "Recomendadas",
          ],
          datasets: [
            {
              data: [
                horasAcademicas,
                horasExtracurriculares,
                horasDescanso,
                horasRecomendadas,
              ],
              backgroundColor: ["#6C9BCF", "#F7D060", "#A0A0A0", "#1B9C85"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true, position: "bottom" },
          },
        },
      });
    }
  } catch (error) {
    console.error("❌ Error al cargar el horario desde MongoDB:", error);
  }
}

// =============================
// 📊 ACTUALIZAR ESTADO DEL HORARIO
// =============================

let estadoHorarioChart = null;

function actualizarEstadoHorario() {
  const estadoHorario = document.getElementById("estado-horario");
  if (estadoHorario) {
    estadoHorario.textContent = "Horario optimizado y equilibrado";
  }

  const ctxEstado = document.getElementById("grafico-estado")?.getContext("2d");

  if (ctxEstado) {
    if (estadoHorarioChart !== null) {
      estadoHorarioChart.destroy();
    }

    estadoHorarioChart = new Chart(ctxEstado, {
      type: "doughnut",
      data: {
        labels: ["Optimizado", "Pendiente"],
        datasets: [
          {
            data: [80, 20], // Se puede modificar según la lógica de disponibilidad
            backgroundColor: ["#1B9C85", "#FF0060"],
          },
        ],
      },
      options: { responsive: true },
    });
  }
}

// =============================
// 🔄 ACTUALIZAR GRÁFICOS AUTOMÁTICAMENTE CUANDO SE AGREGUEN ACTIVIDADES
// =============================

function actualizarResumen() {
  actualizarEstadoHorario();
  actualizarGraficoDistribucion();
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarFecha();
  actualizarEstadoHorario();
  actualizarGraficoDistribucion();
});

// ✅ Vincular la actualización de los gráficos con los eventos de modificación de horario
document
  .getElementById("add-academic")
  ?.addEventListener("click", actualizarResumen);
document
  .getElementById("add-extracurricular")
  ?.addEventListener("click", actualizarResumen);
document
  .getElementById("add-recommended")
  ?.addEventListener("click", actualizarResumen);
document
  .getElementById("delete-activity")
  ?.addEventListener("click", actualizarResumen);

// =============================
// ✅ APLICAR PREFERENCIAS EN LA GESTIÓN DE HORARIOS ✅
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const scheduleBody = document.getElementById("schedule-body");
  const preferencias = localStorage.getItem("preferencias_horario");
  const guardarPreferenciasBtn = document.getElementById(
    "guardar-preferencias"
  );

  if (guardarPreferenciasBtn) {
    guardarPreferenciasBtn.addEventListener("click", () => {
      const horaInicio = document.getElementById("hora-inicio").value;
      const horaFin = document.getElementById("hora-fin").value;

      if (!horaInicio || !horaFin) {
        alert("❌ Por favor, completa todos los campos.");
        return;
      }

      const inicio = parseInt(horaInicio.split(":")[0]);
      const fin = parseInt(horaFin.split(":")[0]);

      if (fin <= inicio) {
        alert("⚠️ La hora de fin debe ser mayor que la de inicio.");
        return;
      }

      // Guardar preferencias en localStorage
      localStorage.setItem(
        "preferencias_horario",
        JSON.stringify({ inicio, fin })
      );

      alert("✅ Preferencias guardadas correctamente.");
    });
  }

  if (scheduleBody && preferencias) {
    const { inicio, fin } = JSON.parse(preferencias);

    for (let i = inicio; i < fin; i++) {
      for (let j = 0; j < 7; j++) {
        // 7 días de la semana
        let cell = document.querySelector(
          `td[data-day="${j}"][data-hour="${i}"]`
        );

        if (!cell) continue;

        // Verificar si ya está ocupado por una actividad académica o extracurricular
        if (
          cell.classList.contains("academic") ||
          cell.classList.contains("extracurricular")
        ) {
          alert(`⚠️ Actividad ocupando este horario (${cell.textContent}).`);
        } else {
          // Marcar en color verde para indicar preferencia de horario
          cell.classList.add("preferred");
          cell.textContent = "Disponible";
        }
      }
    }
  }
});

async function actualizarProximaActividad() {
  const userId = localStorage.getItem("user_id");
  if (!userId) return;

  try {
      const response = await fetch(`http://localhost:8000/get-schedule/${userId}`);
      const horario = await response.json();

      const ahora = new Date();
      const horaActual = ahora.getHours();

      let proximaActividad = null;

      horario.schedule.forEach((actividad) => {
          if (actividad.hour >= horaActual && !proximaActividad) {
              proximaActividad = actividad;
          }
      });

      if (proximaActividad) {
          document.getElementById("actividad-proxima").textContent = `${proximaActividad.type} - ${proximaActividad.subject || "Sin asignar"}`;
      } else {
          document.getElementById("actividad-proxima").textContent = "No hay más actividades hoy.";
      }
  } catch (error) {
      console.error("❌ Error al obtener la próxima actividad:", error);
  }
}

// ✅ Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", actualizarProximaActividad);

