document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("objetivo-form");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const titulo = document.getElementById("titulo").value;
        const descripcion = document.getElementById("descripcion").value;
        const fecha = document.getElementById("fecha").value;

        const nuevaActividad = { titulo, descripcion, fecha, completado: false };

        // Guardar en localStorage
        let actividades = JSON.parse(localStorage.getItem("actividades")) || [];
        actividades.push(nuevaActividad);
        localStorage.setItem("actividades", JSON.stringify(actividades));

        alert("Objetivo guardado con éxito.");
        form.reset();

        window.location.href = "index_recoIA.html";
    });
});
