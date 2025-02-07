from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS  # Importa CORS
from PIL import Image
import io
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import openai
import os
from dotenv import load_dotenv

# Configuración de Flask
app = Flask(__name__)
CORS(app)  # Habilita CORS para todas las rutas

# Cargar variables de entorno
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Cargar modelos de Hugging Face
processor = TrOCRProcessor.from_pretrained('microsoft/trocr-base-printed', use_fast=True)
model = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-base-printed')

# Función para optimizar el horario
def optimize_schedule(text):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Optimiza el siguiente horario para incluir 1 hora de estudio y 30 minutos de caminata diarios:\n{text}",
        max_tokens=200
    )
    return response.choices[0].text.strip()

# Ruta para subir la imagen
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No se subió ningún archivo"}), 400

    file = request.files["file"]
    try:
        image = Image.open(io.BytesIO(file.read())).convert("RGB")
    except Exception as e:
        return jsonify({"error": "Error al procesar la imagen"}), 400

    # Extraer texto de la imagen
    pixel_values = processor(images=image, return_tensors="pt").pixel_values
    generated_ids = model.generate(pixel_values)
    extracted_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

    # Optimizar el horario
    optimized_schedule = optimize_schedule(extracted_text)

    # Devolver los resultados en formato JSON
    return jsonify({
        "extracted_text": extracted_text,
        "optimized_schedule": optimized_schedule,
        "detected_intent": "Optimización de horario"
    })

# Ruta para servir el frontend
@app.route("/")
def serve_frontend():
    return send_from_directory('../frontend', 'indexapp.html')

# Ejecutar la aplicación
if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Ejecuta en el puerto 5000