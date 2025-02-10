// Ejecutando funciones
document.getElementById("btn__iniciar-sesion").addEventListener("click", iniciarSesion);
document.getElementById("btn__registrarse").addEventListener("click", register);
window.addEventListener("resize", anchoPage);
document.getElementById("toggle-theme").addEventListener("click", toggleTheme);

// Declarando variables
var formulario_login = document.querySelector(".formulario__login");
var formulario_register = document.querySelector(".formulario__register");
var contenedor_login_register = document.querySelector(".contenedor__login-register");
var caja_trasera_login = document.querySelector(".caja__trasera-login");
var caja_trasera_register = document.querySelector(".caja__trasera-register");

// Registrar usuario (Asegurarse de que el DOM está cargado)
document.addEventListener("DOMContentLoaded", () => {
    
    // Agrega un evento de escucha al formulario de registro cuando se envía
    document.querySelector(".formulario__register").addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita la recarga de la página al enviar el formulario
        
        // Se obtienen los valores ingresados en los campos del formulario
        const userData = {
            nombre_completo: document.querySelector(".formulario__register input[placeholder='Nombre completo']").value,
            correo_electronico: document.querySelector(".formulario__register input[placeholder='Correo Electronico']").value,
            usuario: document.querySelector(".formulario__register input[placeholder='Usuario']").value,
            password: document.querySelector(".formulario__register input[placeholder='Password']").value
        };

        try {
            // Se envía una solicitud HTTP POST al servidor con los datos del usuario
            const response = await fetch("http://localhost:5000/registrar", {
                method: "POST", // Especifica que es una solicitud POST
                headers: {
                    "Content-Type": "application/json" // Indica que los datos enviados están en formato JSON
                },
                body: JSON.stringify(userData) // Convierte el objeto userData en una cadena JSON para enviarlo
            });

            // Convierte la respuesta del servidor en un objeto JSON
            const data = await response.json();

            if (response.ok) {
                alert(data.mensaje); // Muestra un mensaje de éxito al usuario
                window.location.href = "/dashboard.html"; // Redirige al usuario a la página del dashboard
            } else {
                alert(data.mensaje || "Error en el registro"); // Muestra un mensaje de error si la respuesta no es exitosa
            }
        } catch (error) {
            console.error("Error:", error); // Muestra el error en la consola para depuración
            alert("Error de conexión con el servidor"); // Muestra un mensaje de error en caso de fallo de conexión
        }
    });
});


// FUNCIONES

function anchoPage(){
    if (window.innerWidth > 850){
        caja_trasera_register.style.display = "block";
        caja_trasera_login.style.display = "block";
    } else {
        caja_trasera_register.style.display = "block";
        caja_trasera_register.style.opacity = "1";
        caja_trasera_login.style.display = "none";
        formulario_login.style.display = "block";
        contenedor_login_register.style.left = "0px";
        formulario_register.style.display = "none";   
    }
}

anchoPage();

function iniciarSesion(){
    if (window.innerWidth > 850){
        formulario_login.style.display = "block";
        contenedor_login_register.style.left = "10px";
        formulario_register.style.display = "none";
        caja_trasera_register.style.opacity = "1";
        caja_trasera_login.style.opacity = "0";
    } else {
        formulario_login.style.display = "block";
        contenedor_login_register.style.left = "0px";
        formulario_register.style.display = "none";
        caja_trasera_register.style.display = "block";
        caja_trasera_login.style.display = "none";
    }
}

function register(){
    if (window.innerWidth > 850){
        formulario_register.style.display = "block";
        contenedor_login_register.style.left = "410px";
        formulario_login.style.display = "none";
        caja_trasera_register.style.opacity = "0";
        caja_trasera_login.style.opacity = "1";
    } else {
        formulario_register.style.display = "block";
        contenedor_login_register.style.left = "0px";
        formulario_login.style.display = "none";
        caja_trasera_register.style.display = "none";
        caja_trasera_login.style.display = "block";
        caja_trasera_login.style.opacity = "1";
    }
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-mode");
    body.classList.toggle("light-mode");

    // Cambiar el texto del botón según el modo
    const themeToggleBtn = document.getElementById("toggle-theme");
    if (body.classList.contains("dark-mode")) {
        themeToggleBtn.textContent = "Modo Claro";
    } else {
        themeToggleBtn.textContent = "Modo Oscuro";
    }
}

