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
            const response = await fetch("http://localhost:8000/register", {
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

function iniciarSesion() {
    if (window.innerWidth > 850) {
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

function register() {
    if (window.innerWidth > 850) {
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

    const themeToggleBtn = document.getElementById("toggle-theme");
    themeToggleBtn.textContent = body.classList.contains("dark-mode") ? "Modo Claro" : "Modo Oscuro";
}

// ✅ AGREGAR EVENTOS PARA LOGIN Y REGISTRO
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector(".formulario__login");
    const registerForm = document.querySelector(".formulario__register");

    // 📌 LOGIN
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Captura de datos del formulario
        const email = loginForm.querySelector("input[type='text']").value;
        const password = loginForm.querySelector("input[type='password']").value;

        const response = await fetch("http://127.0.0.1:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                username: email,
                password: password
            })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Login exitoso. Token: " + data.access_token);
            localStorage.setItem("token", data.access_token);
        } else {
            alert("Error en el login: " + data.detail);
        }
    });

    // 📌 REGISTRO
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Captura de datos del formulario
        const name = registerForm.querySelector("input:nth-child(2)").value;
        const email = registerForm.querySelector("input:nth-child(3)").value;
        const username = registerForm.querySelector("input:nth-child(4)").value;
        const password = registerForm.querySelector("input:nth-child(5)").value;

        const response = await fetch("http://127.0.0.1:8000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Registro exitoso");
        } else {
            alert("Error en el registro: " + data.detail);
        }
    });
});
