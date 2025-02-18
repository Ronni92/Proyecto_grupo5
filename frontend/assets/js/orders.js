async function actualizarGraficoDistribucion() {
  const userId = localStorage.getItem("user_id");
  if (!userId) return;

  try {
      const response = await fetch(`http://localhost:8000/get-schedule/${userId}`);
      const horario = await response.json();

      const ahora = new Date();
      const diaActual = ahora.getDay(); // 0 = Domingo, 1 = Lunes...

      let horasAcademicas = 0;
      let horasExtracurriculares = 0;
      let horasDescanso = 24;
      let horasRecomendadas = 0;

      horario.schedule.forEach((actividad) => {
          if (actividad.day === diaActual) {
              if (actividad.type === "academic") {
                  horasAcademicas++;
              } else if (actividad.type === "extracurricular") {
                  horasExtracurriculares++;
              } else if (actividad.type === "preferred") {
                  horasRecomendadas++;
              }
          }
      });

      horasDescanso -= (horasAcademicas + horasExtracurriculares + horasRecomendadas);

      const ctx = document.getElementById("grafico-tiempo").getContext("2d");

      if (window.distribucionChart) {
          window.distribucionChart.destroy();
      }

      window.distribucionChart = new Chart(ctx, {
          type: "pie",
          data: {
              labels: ["Académicas", "Extracurriculares", "Descanso", "Recomendadas"],
              datasets: [{
                  data: [horasAcademicas, horasExtracurriculares, horasDescanso, horasRecomendadas],
                  backgroundColor: ["#6C9BCF", "#F7D060", "#A0A0A0", "#BB86FC"],
              }],
          },
          options: { responsive: true },
      });

  } catch (error) {
      console.error("❌ Error al actualizar el gráfico:", error);
  }
}

// ✅ Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", actualizarGraficoDistribucion);



const Orders = [
  {
    productName: "JavaScript Tutorial",
    productNumber: "85743",
    paymentStatus: "Due",
    status: "Pending",
  },
  {
    productName: "CSS Full Course",
    productNumber: "97245",
    paymentStatus: "Refunded",
    status: "Declined",
  },
  {
    productName: "Flex-Box Tutorial",
    productNumber: "36452",
    paymentStatus: "Paid",
    status: "Active",
  },
];

const actividades = [
  { nombre: "Clase de Matemáticas", hora: "08:00 - 09:30" },
  { nombre: "Estudio Personal", hora: "10:00 - 11:00" },
  { nombre: "Ejercicio", hora: "18:00 - 19:00" },
];

const listaActividades = document.getElementById("lista-actividades");
if (listaActividades) {
  actividades.forEach((act) => {
    const li = document.createElement("li");
    li.textContent = `${act.nombre} - ${act.hora}`;
    listaActividades.appendChild(li);
  });
}

const recordatorios = [
  { titulo: "Entrega de Tarea", hora: "14:00" },
  { titulo: "Reunión de Grupo", hora: "16:30" },
];

const listaRecordatorios = document.getElementById("lista-recordatorios");
if (listaRecordatorios) {
  recordatorios.forEach((reminder) => {
    const div = document.createElement("div");
    div.classList.add("notification");
    div.innerHTML = `<div class='content'><h3>${reminder.titulo}</h3><small>${reminder.hora}</small></div>`;
    listaRecordatorios.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Fecha actual
  document.getElementById("fecha-actual").textContent =
    new Date().toLocaleDateString();

  // Estado del Horario
  document.getElementById("estado-horario").textContent =
    "Horario optimizado y equilibrado";

  // Gráfico de Estado del Horario
  const ctxEstado = document.getElementById("grafico-estado").getContext("2d");
  new Chart(ctxEstado, {
    type: "doughnut",
    data: {
      labels: ["Optimizado", "Pendiente"],
      datasets: [
        {
          data: [80, 20],
          backgroundColor: ["#1B9C85", "#FF0060"],
        },
      ],
    },
    options: { responsive: true },
  });

  // Gráfico de Uso del Tiempo
  const ctxTiempo = document.getElementById("grafico-tiempo").getContext("2d");
  new Chart(ctxTiempo, {
    type: "pie",
    data: {
      labels: ["Estudio", "Clases", "Descanso", "Extracurriculares"],
      datasets: [
        {
          data: [30, 40, 20, 10],
          backgroundColor: ["#6C9BCF", "#F7D060", "#1B9C85", "#FF0060"],
        },
      ],
    },
    options: { responsive: true },
  });
});
