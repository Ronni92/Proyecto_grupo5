from flask import Flask
from flask_cors import CORS
from routes import routes_bp

app = Flask(__name__)
CORS(app)  # Permite solicitudes desde el frontend
app.secret_key = 'tu_clave_secreta'  # Necesario para manejar sesiones

# Registrar el Blueprint
app.register_blueprint(routes_bp)

if __name__ == '__main__':
    app.run(debug=True)