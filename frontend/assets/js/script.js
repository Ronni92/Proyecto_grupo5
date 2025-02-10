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

// 📌 **MODIFICACIÓN 1: Agregamos redirección automática al registrarse**
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".formulario__register").addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita la recarga de la página al enviar el formulario
        
        const userData = {
            nombre: document.querySelector(".formulario__register input[placeholder='Nombre completo']").value,
            correo: document.querySelector(".formulario__register input[placeholder='Correo Electronico']").value,
            usuario: document.querySelector(".formulario__register input[placeholder='Usuario']").value,
            contraseña: document.querySelector(".formulario__register input[placeholder='Contraseña']").value
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok && data.redirect) {
                window.location.href = data.redirect; // 📌 🔹 Redirige automáticamente al usuario sin alertas
            } else {
                console.error("Error en el registro:", data.error);
            }
        } catch (error) {
            console.error("Error en la conexión:", error);
        }
    });
});

// 📌 **MODIFICACIÓN 2: Agregamos redirección automática al iniciar sesión**
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        const userData = {
            usuario: document.getElementById("usuarioLogin").value,
            contraseña: document.getElementById("contraseñaLogin").value
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (response.ok && data.redirect) {
                window.location.href = data.redirect; // 📌 🔹 Redirige automáticamente al usuario sin alertas
            } else {
                console.error("Error en el inicio de sesión:", data.error);
            }
        } catch (error) {
            console.error("Error en la conexión:", error);
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

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn__iniciar-sesion").addEventListener("click", iniciarSesion);
    document.getElementById("btn__registrarse").addEventListener("click", register);
    document.getElementById("toggle-theme").addEventListener("click", toggleTheme);
    
    window.addEventListener("resize", anchoPage);
});
