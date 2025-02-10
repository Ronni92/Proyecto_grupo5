import sys
import os
from flask import Flask
from flask import send_from_directory

# Agregar el directorio actual al path de Python
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from routes import routes_bp  # Ahora Flask podrá encontrar el módulo

app = Flask(__name__, template_folder='../frontend', static_folder='../frontend/assets')
app.register_blueprint(routes_bp)

@app.route('/assets/<path:filename>')
def custom_static(filename):
    return send_from_directory('../frontend/assets',filename)

if __name__ == '__main__':
    app.run(debug=True)