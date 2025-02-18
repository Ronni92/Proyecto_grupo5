import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import google.generativeai as genai
import pickle
from uuid import uuid4
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# Configuración de la clave API desde .env
API_KEY = os.getenv("GEMINI_API_KEY")

# Configuración del modelo de IA
genai.configure(api_key=API_KEY)

app = FastAPI()

# Archivo para almacenar el historial de chat
HISTORIAL_FILE = "historial.pkl"

# Cargar historial si existe
if os.path.exists(HISTORIAL_FILE):
    with open(HISTORIAL_FILE, "rb") as f:
        historial = pickle.load(f)
else:
    historial = {}

# Función para guardar historial en disco
def guardar_historial_en_disco():
    with open(HISTORIAL_FILE, "wb") as f:
        pickle.dump(historial, f)

    @app.websocket("/ws")
    async def websocket_endpoint(websocket: WebSocket):
        await websocket.accept()
        usid = str(uuid4())

        if usid not in historial:
            historial[usid] = []

        try:
            while True:
                user_message = await websocket.receive_text()
                historial[usid].append({"sender": "user", "message": user_message})

                # Llamar a Gemini para respuesta
                try:
                    model = genai.GenerativeModel("gemini-1.5-flash-8b")
                    response = model.generate_content(user_message)
                    bot_response = response.text if response and hasattr(response, "text") else "Error al generar respuesta."
                except Exception as e:
                    bot_response = f"Error: {e}"

                historial[usid].append({"sender": "bot", "message": bot_response})
                guardar_historial_en_disco()

                await websocket.send_json(historial[usid])
        except WebSocketDisconnect:
            del historial[usid]
            guardar_historial_en_disco()