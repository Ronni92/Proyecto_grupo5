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
