// =============================
// ✅ INICIALIZAR EVENTOS AL CARGAR EL DOM ✅
// =============================
document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("dark-mode");

    // Ocultar el botón de cambio de tema en la página de login
    const themeToggleBtn = document.getElementById("toggle-theme");
    if (themeToggleBtn) {
        themeToggleBtn.style.display = "none";
    }

    // Asignar eventos a los botones de cambio de vista (login <-> registro)
    document.getElementById("btn__iniciar-sesion").addEventListener("click", mostrarInicioSesion);
    document.getElementById("btn__registrarse").addEventListener("click", mostrarRegistro);

    // Asignar eventos a los botones de login y registro
    document.getElementById("register-btn").addEventListener("click", async (e) => {
        e.preventDefault();
        await registrarUsuario();
    });

    document.getElementById("login-btn").addEventListener("click", async (e) => {
        e.preventDefault();
        await loginUsuario();
    });

    // Permitir que se presione "Enter" en los campos de login
    document.getElementById("login-password").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            loginUsuario();
        }
    });

    document.getElementById("login-user-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            loginUsuario();
        }
    });

    // Inicializar la vista correcta dependiendo del tamaño de pantalla
    ajustarVista();
    window.addEventListener("resize", ajustarVista);
});

// =============================
// 🔹 VARIABLES GLOBALES 🔹
// =============================
const formulario_login = document.querySelector(".formulario__login");
const formulario_register = document.querySelector(".formulario__register");
const contenedor_login_register = document.querySelector(".contenedor__login-register");
const caja_trasera_login = document.querySelector(".caja__trasera-login");
const caja_trasera_register = document.querySelector(".caja__trasera-register");

// =============================
// 🔹 FUNCIONES PARA MANEJAR VISTAS 🔹
// =============================

// Mostrar el formulario de login
function mostrarInicioSesion() {
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

// Mostrar el formulario de registro
function mostrarRegistro() {
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

// Ajustar vista según el tamaño de la pantalla
function ajustarVista() {
    if (window.innerWidth > 850) {
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

ajustarVista();

// =============================
// 🔹 REGISTRO DE USUARIO 🔹
// =============================
async function registrarUsuario() {
    const userData = {
        name: document.getElementById("register-name").value.trim(),
        email: document.getElementById("register-email").value.trim(),
        username: document.getElementById("register-username").value.trim(),
        password: document.getElementById("register-password").value.trim()
    };

    const errorMessage = document.getElementById("register-error");

    errorMessage.textContent = "";

    if (!userData.name || !userData.email || !userData.username || !userData.password) {
        errorMessage.textContent = "Todos los campos son obligatorios.";
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (response.ok) {
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            mostrarInicioSesion(); 
        } else {
            errorMessage.textContent = "Error: " + data.detail;
        }
    } catch (error) {
        console.error("Error en el registro:", error);
        errorMessage.textContent = "Hubo un error al conectar con el servidor.";
    }
}

// =============================
// 🔹 INICIO DE SESIÓN 🔹
// =============================
async function loginUsuario() {
    const userInput = document.getElementById("login-user-input").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const errorMessage = document.getElementById("login-error");
    const welcomeScreen = document.getElementById("welcome-screen");
    const welcomeMessage = document.getElementById("welcome-message");

    errorMessage.textContent = "";

    if (!userInput || !password) {
        errorMessage.textContent = "Por favor, ingresa tu correo/usuario y contraseña.";
        return;
    }

    const loginData = {
        user_input: userInput, 
        password: password
    };

    try {
        const response = await fetch("http://localhost:8000/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (response.ok) {
            // ✅ Guardar datos en localStorage
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("username", data.username);

            // ✅ Pantalla de bienvenida con transición
            welcomeMessage.textContent = `Bienvenido, ${data.username}. Es un placer que estés con nosotros.`;
            welcomeScreen.style.display = "flex";

            // ✅ Esperar 2 segundos antes de redirigir
            setTimeout(() => {
                window.location.href = "index_inicio.html"; 
            }, 2000);
        } else {
            if (data.detail === "Credenciales incorrectas") {
                errorMessage.textContent = "Contraseña incorrecta.";
            } else if (data.detail === "Usuario ingresado no existe") {
                errorMessage.textContent = "Usuario ingresado no existe.";
            } else {
                errorMessage.textContent = "Error desconocido.";
            }
        }
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        errorMessage.textContent = "Hubo un error al conectar con el servidor.";
    }
}

// =============================
// 🔹 CERRAR SESIÓN 🔹
// =============================
function logout() {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    console.log("🚪 Cierre de sesión exitoso.");
    window.location.href = "index.html";
}
