
from flask import Flask, request, jsonify
from .database import registrar_usuario, iniciar_sesion

app = Flask(__name__)

# Ruta para registrar un nuevo usuario
@app.route('/registrar', methods=['POST'])
def registrar():
    data = request.json
    nombre = data['nombre_completo']
    correo = data['correo_electronico']
    usuario = data['usuario']
    contraseña = data['contraseña']

    registrar_usuario(nombre, correo, usuario, contraseña)
    return jsonify({"mensaje": "Usuario registrado correctamente"}), 201

# Ruta para iniciar sesión
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    usuario = data['usuario']
    contraseña = data['contraseña']

    user = iniciar_sesion(usuario, contraseña)
    if user:
        return jsonify({"mensaje": "Inicio de sesión exitoso", "usuario": user})
    else:
        return jsonify({"mensaje": "Usuario o contraseña incorrectos"}), 401