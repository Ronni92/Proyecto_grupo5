// =============================
// ✅ VERIFICAR SESIÓN DEL USUARIO ✅
// =============================
document.addEventListener("DOMContentLoaded", () => {
  let userId = localStorage.getItem("user_id");
  let username = localStorage.getItem("username");

  if (!userId || userId === "null" || userId === "undefined") {
    console.warn(
      "⚠️ No se encontró usuario en localStorage, redirigiendo al login..."
    );
    mostrarMensajeError(
      "session-error",
      "⚠️ No tienes una sesión activa. Inicia sesión primero."
    );
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } else {
    userId = parseInt(userId);
    console.log(`✅ Usuario autenticado con ID: ${userId}`);

    // ✅ Mostrar nombre de usuario en la interfaz
    if (document.getElementById("username-display")) {
      document.getElementById("username-display").textContent = username;
    }

    // ✅ Inicializar perfil del usuario si es la página correcta
    if (document.getElementById("user-photo")) {
      initUserProfile(userId);
    } else {
      console.warn(
        "⚠️ No se encontró 'user-photo', no se inicializa el perfil."
      );
    }
  }
});

// =============================
// ✅ INICIO DE SESIÓN ✅
// =============================
async function loginUsuario() {
  const userInput = document.getElementById("login-user-input").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!userInput || !password) {
    alert("❌ Ingresa tu usuario/correo y contraseña.");
    return;
  }

  const loginData = { user_input: userInput, password: password };

  try {
    const response = await fetch("http://localhost:8000/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ Guardar sesión correctamente en localStorage
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("username", data.username); // Guarda el nombre de usuario

      console.log(
        `✅ Usuario ${data.username} almacenado con ID: ${data.user_id}`
      );

      // ✅ Redirigir a configuración
      window.location.href = "index_configuraciones.html";
    } else {
      alert("❌ Error: " + data.detail);
    }
  } catch (error) {
    console.error("❌ Error en el inicio de sesión:", error);
  }
}

// =============================
// ✅ CERRAR SESIÓN ✅
// =============================
function logout() {
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
  window.location.href = "index.html";
}
// =============================
// ✅ INICIALIZAR PERFIL DE USUARIO ✅
// =============================
function initUserProfile(userId) {
  loadUserPhoto(userId);

  const updatePhotoBtn = document.getElementById("update-photo");
  const updatePasswordBtn = document.getElementById("update-password");

  if (updatePhotoBtn) {
    updatePhotoBtn.addEventListener("click", () => uploadUserPhoto(userId));
  } else {
    console.warn("⚠️ Botón 'update-photo' no encontrado.");
  }

  if (updatePasswordBtn) {
    updatePasswordBtn.addEventListener("click", () =>
      changeUserPassword(userId)
    );
  } else {
    console.warn("⚠️ Botón 'update-password' no encontrado.");
  }
}
// =============================
// ✅ CARGAR FOTO DE PERFIL DESDE EL BACKEND ✅
// =============================
async function loadUserPhoto(userId) {
  try {
    const response = await fetch(`http://localhost:8000/get-photo/${userId}`);
    const data = await response.json();

    if (data.image) {
      const imageSrc = `data:image/png;base64,${data.image}`;

      // ✅ Guardar la imagen en `localStorage`
      localStorage.setItem("user_photo", imageSrc);

      // ✅ Actualizar la foto en todas las instancias
      actualizarFotoPerfil(imageSrc);
    } else {
      actualizarFotoPerfil(null);
    }
  } catch (err) {
    console.error("❌ Error al obtener la foto de perfil:", err);
    actualizarFotoPerfil(null);
  }
}

// =============================
// 📤 SUBIR FOTO DE PERFIL Y GUARDAR EN LOCALSTORAGE 📤
// =============================
async function uploadUserPhoto(userId) {
  const fileInput = document.getElementById("upload-photo");
  const mensaje = document.getElementById("photo-message");

  if (!fileInput.files.length) {
    mostrarMensajeError(mensaje, "❌ Selecciona una imagen antes de subir.");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("user_id", userId);

  try {
    const response = await fetch("http://localhost:8000/update-photo/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ Guardar imagen en localStorage
      const imageSrc = `data:image/png;base64,${data.image}`;
      localStorage.setItem("user_photo", imageSrc);

      // ✅ Actualizar todas las instancias de la foto de perfil
      actualizarFotoPerfil(imageSrc);

      mostrarMensajeExito(mensaje, "✅ Foto de perfil actualizada.");
    } else {
      mostrarMensajeError(mensaje, "❌ Error al subir la foto.");
    }
  } catch (error) {
    console.error("❌ Error al subir la foto:", error);
    mostrarMensajeError(mensaje, "❌ Hubo un error al actualizar la foto.");
  }
}

// =============================
// 🔐 CAMBIO DE CONTRASEÑA 🔐
// =============================
async function changeUserPassword(userId) {
  const currentPassword = document
    .getElementById("current-password")
    .value.trim();
  const newPassword = document.getElementById("new-password").value.trim();
  const confirmPassword = document
    .getElementById("confirm-password")
    .value.trim();
  const mensaje = document.getElementById("password-message");

  mensaje.textContent = ""; // Limpiar mensajes previos

  if (!currentPassword || !newPassword || !confirmPassword) {
    mostrarMensajeError(mensaje, "❌ Completa todos los campos.");
    return;
  }
  if (newPassword.length < 6) {
    mostrarMensajeError(
      mensaje,
      "⚠️ La nueva contraseña debe tener al menos 6 caracteres."
    );
    return;
  }
  if (newPassword !== confirmPassword) {
    mostrarMensajeError(mensaje, "❌ Las contraseñas no coinciden.");
    return;
  }

  const payload = {
    user_id: userId,
    current_password: currentPassword,
    new_password: newPassword,
  };

  try {
    const response = await fetch("http://localhost:8000/update-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok) {
      mostrarMensajeExito(mensaje, "✅ Contraseña actualizada correctamente.");
      document.getElementById("current-password").value = "";
      document.getElementById("new-password").value = "";
      document.getElementById("confirm-password").value = "";
      setTimeout(() => {
        logout(); // Cierra sesión y redirige al login
      }, 2000);
    } else {
      mostrarMensajeError(mensaje, "❌ Clave ingresada incorrecta.");
    }
  } catch (error) {
    console.error("❌ Error al cambiar la contraseña:", error);
    mostrarMensajeError(mensaje, "❌ Hubo un error al cambiar la contraseña.");
  }
}

// =============================
// ✅ FUNCIONES PARA MOSTRAR MENSAJES ✅
// =============================
function mostrarMensajeExito(elemento, mensaje) {
  if (!elemento) return;
  elemento.textContent = mensaje;
  elemento.style.color = "green";
  elemento.style.fontWeight = "bold";
}

function mostrarMensajeError(elemento, mensaje) {
  if (!elemento) return;
  elemento.textContent = mensaje;
  elemento.style.color = "red";
  elemento.style.fontWeight = "bold";
}
