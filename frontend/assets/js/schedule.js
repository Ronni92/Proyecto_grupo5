document.addEventListener("DOMContentLoaded", () => {
  const scheduleBody = document.getElementById("schedule-body");
  let selectedType = ""; // Tipo de actividad seleccionada

  // Generar las filas del horario (24h x 7 días)
  for (let i = 0; i < 24; i++) {
      let row = document.createElement("tr");
      let hourCell = document.createElement("td");
      hourCell.textContent = `${i.toString().padStart(2, '0')}:00 - ${(
          i + 1
      ).toString().padStart(2, '0')}:00`;
      row.appendChild(hourCell);

      for (let j = 0; j < 7; j++) {
          let cell = document.createElement("td");
          cell.dataset.day = j;
          cell.dataset.hour = i;
          cell.addEventListener("click", () => toggleActivity(cell));
          row.appendChild(cell);
      }

      scheduleBody.appendChild(row);
  }

  // Función para cambiar el estado de una celda
  function toggleActivity(cell) {
      if (!selectedType) return;

      cell.classList.remove("academic", "extracurricular");
      if (selectedType !== "delete") {
          cell.classList.add(selectedType);
      } else {
          cell.textContent = "";
      }
  }

  // Botones de actividad
  document.getElementById("add-academic").addEventListener("click", () => {
      selectedType = "academic";
  });

  document.getElementById("add-extracurricular").addEventListener("click", () => {
      selectedType = "extracurricular";
  });

  document.getElementById("delete-activity").addEventListener("click", () => {
      selectedType = "delete";
  });

  // Subida de PDF (Simulación)
  document.getElementById("process-pdf").addEventListener("click", () => {
      alert("Funcionalidad de IA en desarrollo: Pronto podrás cargar tu horario en PDF.");
  });
});
