import sys
import os
from flask import Flask
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from routes import routes_bp

# Agregar el directorio actual al path de Python
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configuración de Flask
app = Flask(__name__, template_folder='../../frontend', static_folder='../../frontend/assets')

# Configuración de la base de datos PostgreSQL para SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:Ares:1997@localhost/registro"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar SQLAlchemy
db = SQLAlchemy(app)

# Configuración de sesiones con PostgreSQL
app.config['SECRET_KEY'] = 'tu_clave_secreta'
app.config['SESSION_TYPE'] = 'sqlalchemy'
app.config['SESSION_SQLALCHEMY'] = db  # Asegura que las sesiones usen la misma conexión

# Inicializar sesión
Session(app)

# Registrar las rutas
app.register_blueprint(routes_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Crea la tabla de sesiones en PostgreSQL si no existe
    app.run(debug=True)
