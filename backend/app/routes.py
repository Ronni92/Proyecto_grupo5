from flask import Blueprint, render_template, request, redirect, url_for, session
from database import registrar_usuario, iniciar_sesion
import bcrypt
import os

# ✅ Asegurar que Flask puede encontrar el index.html
template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend"))

routes_bp = Blueprint('routes', __name__, template_folder=template_dir)

# Ruta principal
@routes_bp.route('/')
def home():
    return render_template('index.html')

# Ruta para el login
# Ruta para el login
@routes_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form.get('usuario')
        password = request.form.get('password')

        if not usuario or not password:
            return render_template('index.html', error="Usuario y contraseña son obligatorios")

        user = iniciar_sesion(usuario, password)

        if not user:
            return render_template('index.html', error="Usuario o contraseña incorrectos")

        # Si el usuario existe y la contraseña es correcta
        session['user_id'] = user[0]  # Guardar el ID del usuario en la sesión
        session['user_name'] = user[1]  # Guardar el nombre del usuario en la sesión

        print("Redirigiendo a la página de inicio...")  # Agrega este print para verificar
        return redirect(url_for('routes.index_inicio'))  # Redirige a la nueva página

    return render_template('index.html')


# Ruta para el registro
@routes_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        nombre = request.form.get('nombre')
        correo = request.form.get('correo')
        usuario = request.form.get('usuario')
        password = request.form.get('password')

        if not nombre or not correo or not usuario or not password:
            return render_template('index.html', error="Todos los campos son obligatorios")

        if len(password) < 8:
            return render_template('index.html', error="La contraseña debe tener al menos 8 caracteres")

        try:
            registrar_usuario(nombre, correo, usuario, password)
            return redirect(url_for('routes.index_inicio'))
        except Exception as e:
            return render_template('index.html', error="Error al registrar el usuario: " + str(e))

    return render_template('index.html')

# Ruta para la página de inicio después del login
@routes_bp.route('/index_inicio')
def index_inicio():
    # Verifica que el usuario esté logueado
    if 'user_id' not in session:
        return redirect(url_for('routes.index'))  # Redirige al login si no está logueado

    return render_template('index_inicio.html')
