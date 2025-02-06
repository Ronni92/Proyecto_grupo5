from flask import Flask, request, jsonify
from pymongo import MongoClient
from PIL import Image
import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import openai  # Librería para interactuar con Groq
import io
import os

# Configuración de Flask
app = Flask(__name__)

# Conexión a MongoDB
#client = MongoClient("mongodb://localhost:27017/")
#db = client["horario_db"]
#collection = db["horarios"]

# Cargar API Key de Groq desde variables de entorno
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Cargar modelos de Hugging Face para OCR
ocr_processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-printed")
ocr_model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-printed")

def classify_intent_with_groq(user_request):
    """
    Utiliza Groq para clasificar la intención del usuario.
    """
    if not GROQ_API_KEY:
        return "Error: API Key de Groq no configurada"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    prompt = f"""
    Analiza la siguiente solicitud y determina su intención principal:
    
    Solicitud: "{user_request}"
    
    Posibles intenciones:
    1. Optimizar horario
    2. Mejorar tiempo de estudio
    3. Preparación para exámenes
    
    Devuelve solo el número y el nombre de la intención más relevante.
    """

    response = openai.ChatCompletion.create(
        model="llama3-8b",  # Puedes probar otros modelos de Groq
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
        max_tokens=50
    )

    return response["choices"][0]["message"]["content"].strip()

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    image = Image.open(io.BytesIO(file.read())).convert("RGB")
    
    # OCR: Extraer texto de la imagen
    pixel_values = ocr_processor(images=image, return_tensors="pt").pixel_values
    generated_ids = ocr_model.generate(pixel_values)
    extracted_text = ocr_processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    
    # Obtener la intención del usuario con Groq
    user_request = request.form.get("request", "")
    detected_intent = classify_intent_with_groq(user_request)
    
    # Guardar en MongoDB
    horario_data = {
        "original_text": extracted_text,
        "user_request": user_request,
        "intent": detected_intent,
    }
    collection.insert_one(horario_data)
    
    return jsonify({
        "extracted_text": extracted_text,
        "detected_intent": detected_intent,
    })

if __name__ == "__main__":
    app.run(debug=True)
