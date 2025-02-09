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
    document.querySelector(".formulario__register button").addEventListener("click", async (e) => {
        e.preventDefault();
        
        const userData = {
            name: document.querySelector(".formulario__register input[placeholder='Nombre completo']").value,
            email: document.querySelector(".formulario__register input[placeholder='Correo Electronico']").value,
            password: document.querySelector(".formulario__register input[placeholder='Contraseña']").value
        };

        try {
            // Ejemplo en el registro
            const response = await fetch("/api/register", {  // <-- Usa /api
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });
            
            if (response.ok) {
                window.location.href = "/dashboard.html";
            } else {
                alert("Error en el registro");
            }
        } catch (error) {
            console.error("Error:", error);
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

