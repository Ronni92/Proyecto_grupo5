document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Aquí puedes añadir la lógica para validar el inicio de sesión
        console.log('Correo Electrónico:', email);
        console.log('Contraseña:', password);

        // Ejemplo de validación simple
        if (email && password) {
            alert('Inicio de sesión exitoso');
            // Redirigir al usuario a otra página
            // window.location.href = 'dashboard.html';
        } else {
            alert('Por favor, completa todos los campos');
        }
    });
});