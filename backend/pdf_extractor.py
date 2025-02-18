import pdfplumber
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

# 🔹 Cargar variables del entorno
load_dotenv()

# 📌 Configurar la API Key de Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def extraer_horarios(pdf_path):
    """ Extrae texto del PDF y usa Gemini AI para organizarlo en JSON."""
    extracted_text = ""

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"

    if not extracted_text.strip():
        return {"error": "No se pudo extraer texto del PDF"}

    prompt = f"""
    Analiza el siguiente texto extraído de un PDF y extrae los horarios de clases en formato JSON.

    📌 **Instrucciones clave:**  
    1️⃣ Extrae **todas las materias** con sus respectivos días y horarios.  
    2️⃣ Si hay varias materias el mismo día, **inclúyelas todas sin repetir**.  
    3️⃣ Usa los **nombres exactos de las materias**.  
    4️⃣ **No inventes horarios ni asignaturas** que no estén en el PDF.  
    5️⃣ **Devuelve solo un JSON puro sin explicaciones.**  

    Texto extraído del PDF:
    {extracted_text}
    """

    try:
        model = genai.GenerativeModel("gemini-1.5-flash-8b")
        response = model.generate_content(prompt)

        structured_data = response.text.strip()
        structured_data = structured_data.replace("```json", "").replace("```", "").strip()
        horarios_json = json.loads(structured_data)

        return {"message": "PDF procesado correctamente", "horarios": horarios_json}

    except json.JSONDecodeError:
        return {"error": "Gemini devolvió una respuesta inválida, revisar formato JSON."}
    except Exception as e:
        return {"error": f"Error al procesar con Gemini: {e}"}
