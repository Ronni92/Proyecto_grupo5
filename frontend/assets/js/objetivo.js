document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    const tareasContainer = document.getElementById("tareas-container");

    try {
        const response = await fetch(`http://localhost:8000/get-objetivos/${userId}`);
        const objetivos = await response.json();

        tareasContainer.innerHTML = ""; // Limpiar contenedor

        if (objetivos.length === 0) {
            tareasContainer.innerHTML = "<p>No hay objetivos recomendados.</p>";
            return;
        }

        objetivos.forEach((objetivo) => {
            const div = document.createElement("div");
            div.classList.add("card");
            div.innerHTML = `
                <h3>${objetivo.titulo}</h3>
                <p>${objetivo.descripcion}</p>
                <p><strong>Días Restantes:</strong> ${objetivo.diasObjetivo}</p>
                <button class="completar-btn" data-id="${objetivo._id}">Marcar como Completado</button>
            `;
            tareasContainer.appendChild(div);
        });

        document.querySelectorAll(".completar-btn").forEach((btn) => {
            btn.addEventListener("click", async (event) => {
                const objetivoId = event.target.getAttribute("data-id");

                try {
                    const response = await fetch(`http://localhost:8000/completar-objetivo/${objetivoId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ completado: true })
                    });

                    if (response.ok) {
                        alert("✅ Objetivo completado.");
                        window.location.reload();
                    } else {
                        alert("❌ No se pudo completar el objetivo.");
                    }
                } catch (error) {
                    console.error("❌ Error al completar el objetivo:", error);
                }
            });
        });

    } catch (error) {
        console.error("❌ Error al cargar los objetivos:", error);
    }
});
