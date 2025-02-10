import os
from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from models import registrar_usuario, verificar_usuario

# Configurar el blueprint
template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "frontend"))
routes_bp = Blueprint('routes', __name__, template_folder=template_dir)

@routes_bp.route('/')
def home():
    return render_template('index.html')

@routes_bp.route('/index_inicio')
def index_inicio():
    if 'usuario' in session:
        return render_template('index_inicio.html')
    return redirect(url_for('routes.home'))

@routes_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if not all(k in data for k in ('nombre', 'correo', 'usuario', 'contraseña')):
        return jsonify({"error": "Datos incompletos"}), 400

    if registrar_usuario(data['nombre'], data['correo'], data['usuario'], data['contraseña']):
        session['usuario'] = data['usuario']  # Mantener sesión iniciada
        return jsonify({"mensaje": "Registro exitoso", "redirect": "/"}), 201  # Redirige al home (index.html)
    else:
        return jsonify({"error": "No se pudo registrar el usuario"}), 400

@routes_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    if verificar_usuario(data['usuario'], data['contraseña']):
        session['usuario'] = data['usuario']
        return jsonify({"mensaje": "Inicio de sesión exitoso", "redirect": "/index_inicio"}), 200
    else:
        return jsonify({"error": "Usuario o contraseña incorrectos"}), 401

@routes_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('usuario', None)
    return jsonify({"mensaje": "Sesión cerrada correctamente", "redirect": "/"}), 200
