document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generar-recomendaciones").addEventListener("click", generarRecomendaciones);
});

async function generarRecomendaciones() {
  const objetivo = document.getElementById("input-objetivo").value;
  const horasDisponibles = parseInt(document.getElementById("input-horas").value, 10);

  if (!objetivo || isNaN(horasDisponibles)) {
      alert("⚠️ Ingresa un objetivo válido y las horas disponibles.");
      return;
  }

  try {
      const response = await fetch("http://localhost:8000/recomendaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ objetivo, horasDisponibles })
      });

      const data = await response.json();
      
      if (response.ok) {
          alert(data.message);
          mostrarActividadesRecomendadas(data.actividades);
      } else {
          alert("❌ Error al generar recomendaciones.");
      }
  } catch (error) {
      console.error("❌ Error generando recomendaciones:", error);
      alert("⚠️ No se pudo generar recomendaciones. Inténtalo más tarde.");
  }
}

function mostrarActividadesRecomendadas(actividades) {
  const listaActividades = document.getElementById("lista-actividades");
  listaActividades.innerHTML = "";

  if (actividades.length === 0) {
      listaActividades.innerHTML = "<p>⚠️ No hay actividades recomendadas en este momento.</p>";
      return;
  }

  actividades.forEach(actividad => {
      const li = document.createElement("li");
      li.textContent = `${actividad.descripcion} (${actividad.tipo})`;
      li.classList.add("pendiente");

      const completarBtn = document.createElement("button");
      completarBtn.textContent = "Completar";
      completarBtn.onclick = () => li.classList.add("completada");

      li.appendChild(completarBtn);
      listaActividades.appendChild(li);
  });
}
