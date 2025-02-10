import sys
import os
from flask import Flask

# Agregar el directorio actual al path de Python
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from routes import routes_bp  # Ahora Flask podrá encontrar el módulo

app = Flask(__name__, template_folder='../frontend', static_folder='../frontend/assets')
app.register_blueprint(routes_bp)

if __name__ == '__main__':
    app.run(debug=True)