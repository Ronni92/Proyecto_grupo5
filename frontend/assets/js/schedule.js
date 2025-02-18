document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ Script cargado correctamente.");

  const scheduleBody = document.getElementById("schedule-body");
  const startHourSelect = document.getElementById("select-start-hour");
  const endHourSelect = document.getElementById("select-end-hour");
  const toggleDaysButton = document.getElementById("toggle-days");
  const daysCard = document.getElementById("days-card");
  const schedulePanel = document.querySelector(".schedule-panel");

  if (scheduleBody) {
    scheduleBody.innerHTML = ""; // Limpiar antes de generar

    for (let i = 0; i < 24; i++) {
      let row = document.createElement("tr");
      let hourCell = document.createElement("td");
      hourCell.textContent = `${i}:00 - ${i + 1}:00`;
      row.appendChild(hourCell);

      for (let j = 0; j < 7; j++) {
        let cell = document.createElement("td");
        cell.dataset.day = j;
        cell.dataset.hour = i;
        row.appendChild(cell);
      }
      scheduleBody.appendChild(row);
    }
  } else {
    console.error("❌ No se encontró 'schedule-body' en el DOM.");
  }

  // 🔹 Generar opciones de horas en los selects de inicio y fin
  function populateHourSelects() {
    startHourSelect.innerHTML = "";
    endHourSelect.innerHTML = "";

    for (let i = 0; i < 24; i++) {
      let optionStart = document.createElement("option");
      let optionEnd = document.createElement("option");

      optionStart.value = optionEnd.value = i;
      optionStart.textContent = optionEnd.textContent = `${i}:00`;

      startHourSelect.appendChild(optionStart);
      endHourSelect.appendChild(optionEnd);
    }

    // Seleccionar valores por defecto
    startHourSelect.value = "7"; // 7:00 AM
    endHourSelect.value = "9"; // 9:00 AM
  }
  populateHourSelects();

  // 🔹 Evitar que la hora de fin sea menor que la de inicio
  startHourSelect.addEventListener("change", () => {
    if (parseInt(endHourSelect.value) <= parseInt(startHourSelect.value)) {
      endHourSelect.value = parseInt(startHourSelect.value) + 1;
    }
  });

  endHourSelect.addEventListener("change", () => {
    if (parseInt(endHourSelect.value) <= parseInt(startHourSelect.value)) {
      alert("La hora de fin debe ser mayor que la de inicio.");
      endHourSelect.value = parseInt(startHourSelect.value) + 1;
    }
  });

  // 🔹 Generar las filas de la tabla de horarios
  function generateScheduleTable() {
    scheduleBody.innerHTML = "";

    for (let i = 0; i < 24; i++) {
      let row = document.createElement("tr");
      let hourCell = document.createElement("td");
      hourCell.textContent = `${i}:00 - ${i + 1}:00`;
      row.appendChild(hourCell);

      for (let j = 0; j < 7; j++) {
        let cell = document.createElement("td");
        cell.dataset.day = j;
        cell.dataset.hour = i;
        row.appendChild(cell);
      }
      scheduleBody.appendChild(row);
    }
  }
  generateScheduleTable();

  toggleDaysButton.addEventListener("click", () => {
    daysCard.classList.toggle("visible");
  });

  // 🔹 Función para obtener los días seleccionados
  function obtenerDiasSeleccionados() {
    return Array.from(document.querySelectorAll(".day-checkbox:checked")).map(
      (cb) => parseInt(cb.value)
    );
  }

  // 🔹 Función para agregar actividades al horario
  function agregarActividad(tipo) {
    const selectedDays = obtenerDiasSeleccionados();
    const startHour = parseInt(startHourSelect.value);
    const endHour = parseInt(endHourSelect.value);
    const subject = document.getElementById("academic-subject").value.trim();

    if (selectedDays.length === 0) {
      alert("Por favor selecciona al menos un día.");
      return;
    }

    if (subject === "" && tipo === "academic") {
      alert("Por favor ingresa una materia antes de agregar.");
      return;
    }

    selectedDays.forEach((day) => {
      for (let i = startHour; i < endHour; i++) {
        let cell = document.querySelector(
          `td[data-day="${day}"][data-hour="${i}"]`
        );
        if (!cell) continue;

        // Verificar si ya está ocupada
        if (
          cell.classList.contains("academic") ||
          cell.classList.contains("extracurricular")
        ) {
          alert(
            `⚠️ Hay una actividad ocupando este horario (${cell.textContent}).`
          );
          continue;
        }

        // Aplicar clases según el tipo
        cell.classList.remove("academic", "extracurricular", "preferred");
        cell.classList.add(tipo);

        // Establecer el texto en la celda
        if (tipo === "academic") {
          cell.textContent = subject;
        } else if (tipo === "extracurricular") {
          cell.textContent = "Actividad";
        } else if (tipo === "preferred") {
          cell.textContent = "Disponible";
        }
      }
    });

    actualizarResumen();
  }

  // 🔹 Botones de agregar actividades
  document
    .getElementById("add-academic")
    .addEventListener("click", () => agregarActividad("academic"));
  document
    .getElementById("add-extracurricular")
    .addEventListener("click", () => agregarActividad("extracurricular"));
  document
    .getElementById("add-recommended")
    .addEventListener("click", () => agregarActividad("preferred")); // Nuevo botón para "Recomendadas"

  // 🔹 Botón para eliminar actividad
  document.getElementById("delete-activity").addEventListener("click", () => {
    const selectedDays = obtenerDiasSeleccionados();
    const startHour = parseInt(startHourSelect.value);
    const endHour = parseInt(endHourSelect.value);

    selectedDays.forEach((day) => {
      for (let i = startHour; i < endHour; i++) {
        let cell = document.querySelector(
          `td[data-day="${day}"][data-hour="${i}"]`
        );
        if (cell) {
          cell.textContent = "";
          cell.classList.remove("academic", "extracurricular", "preferred");
        }
      }
    });

    actualizarResumen();
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

  // 🔹 Ejecutar antes de pintar los datos
  document.addEventListener("DOMContentLoaded", () => {
    generarTablaHorarios();
    setTimeout(() => {
      cargarHorarios();
    }, 500);
  });

  // ✅ Ejecutar al cargar la página
  document.addEventListener("DOMContentLoaded", generarTablaHorarios);

  // 🔹 Actualizar el resumen de horas
  function actualizarResumen() {
    let totalHoras = 0,
      academicHours = 0,
      extracurricularHours = 0;

    document
      .querySelectorAll("td.academic, td.extracurricular")
      .forEach((cell) => {
        totalHoras++;
        if (cell.classList.contains("academic")) academicHours++;
        if (cell.classList.contains("extracurricular")) extracurricularHours++;
      });

    document.getElementById("total-horas").textContent = totalHoras;
    document.getElementById("academic-hours").textContent = academicHours;
    document.getElementById("extracurricular-hours").textContent =
      extracurricularHours;
  }

  console.log("✅ Sistema funcionando correctamente.");
});
