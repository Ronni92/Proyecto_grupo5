document.addEventListener("DOMContentLoaded", () => {
  // Mostrar / ocultar cambio de foto
  document.getElementById("change-photo").addEventListener("click", () => {
    document.getElementById("photo-section").classList.toggle("hidden");
  });
  document.getElementById("close-photo").addEventListener("click", () => {
    document.getElementById("photo-section").classList.add("hidden");
  });

  // Mostrar / ocultar cambio de contraseña
  document.getElementById("change-password").addEventListener("click", () => {
    document.getElementById("password-section").classList.toggle("hidden");
  });
  document.getElementById("close-password").addEventListener("click", () => {
    document.getElementById("password-section").classList.add("hidden");
  });

  // Guardar preferencias
  document
    .getElementById("guardar-preferencias")
    .addEventListener("click", () => {
      alert("Preferencias guardadas correctamente.");
    });

  // Actualizar foto de perfil
  document.getElementById("update-photo").addEventListener("click", () => {
    alert("Foto de perfil actualizada.");
    document.getElementById("photo-section").classList.add("hidden");
  });

  // Actualizar contraseña
  document.getElementById("update-password").addEventListener("click", () => {
    alert("Contraseña actualizada correctamente.");
    document.getElementById("password-section").classList.add("hidden");
  });

  // Generar un consejo diario de productividad
  const consejos = [
    "Toma pausas activas cada 45 minutos para mantener tu concentración.",
    "Planifica tu día antes de comenzar para optimizar tu tiempo.",
    "Evita distracciones digitales al estudiar o trabajar.",
    "Duerme al menos 7 horas para mejorar tu rendimiento.",
    "Utiliza la técnica Pomodoro: 25 min de trabajo y 5 min de descanso.",
  ];

  document.getElementById("daily-tip").textContent =
    consejos[Math.floor(Math.random() * consejos.length)];

  // Gráfico de Distribución del Tiempo
  const ctxDistribucion = document
    .getElementById("grafico-distribucion")
    .getContext("2d");
  new Chart(ctxDistribucion, {
    type: "pie",
    data: {
      labels: ["Estudio", "Clases", "Descanso", "Extracurriculares"],
      datasets: [
        {
          data: [30, 40, 20, 10], // Datos simulados
          backgroundColor: ["#6C9BCF", "#F7D060", "#1B9C85", "#FF0060"],
        },
      ],
    },
    options: { responsive: true },
  });
});
