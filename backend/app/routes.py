from flask import Blueprint, render_template

routes_bp = Blueprint('routes', __name__, template_folder='../../frontend')

@routes_bp.route('/')
def home():
    return render_template('index.html')  # Flask ahora buscará index.html en frontend/