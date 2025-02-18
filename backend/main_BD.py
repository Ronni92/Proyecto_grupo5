import os
import base64
import json
import requests
import pdfplumber
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body, Depends
from sqlalchemy import create_engine, Column, Integer, String, LargeBinary, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr #validación de datos y gestion de configuración de datps
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List

# 🔹 Cargar variables del .env
load_dotenv()

# 🔹 Configuración de PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("❌ ERROR: La variable DATABASE_URL no está definida en .env")

try:
    engine = create_engine(DATABASE_URL, echo=False)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    print("✅ Conexión exitosa a PostgreSQL")
except Exception as e:
    print(f"❌ Error en la conexión a PostgreSQL: {e}")
    raise

Base = declarative_base()

# 🔹 Configuración de MongoDB
MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client.schedulai
schedule_collection = db.schedules
activities_collection = db.activities  # Nueva colección para actividades

# 🔹 Modelos en PostgreSQL
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

class ProfilePicture(Base):
    __tablename__ = "profile_picture"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    image = Column(LargeBinary, nullable=False)

# 🔹 Crear tablas en PostgreSQL
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas correctamente en PostgreSQL")
except Exception as e:
    print(f"❌ Error al crear tablas: {e}")

# 🔹 Configuración de Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateText"


# 🔹 FastAPI app
app = FastAPI()

# 🔹 Configurar CORS para permitir conexiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Configuración de encriptación de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🔹 Modelos para la API
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    user_input: str  
    password: str

class PasswordUpdate(BaseModel):
    user_id: int
    current_password: str
    new_password: str

class ScheduleEntry(BaseModel):
    day: int
    hour: int
    type: str  # "academic", "extracurricular", "preferred"
    subject: Optional[str] = None  # Solo para "academic"

class ScheduleRequest(BaseModel):
    user_id: int
    schedule: List[ScheduleEntry]

class RecommendationRequest(BaseModel):
    objetivo: str
    horasDisponibles: int

# 🔹 Obtener sesión de PostgreSQL
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    
    # ================================
# ✅ GUARDAR Y OBTENER HORARIOS EN MONGODB
# ================================


@app.post("/save-schedule/")
async def save_schedule(request: ScheduleRequest = Body(...)):
    try:
        # Eliminar horarios anteriores del usuario
        schedule_collection.delete_many({"user_id": request.user_id})

        schedule_data = {
            "user_id": request.user_id,
            "ActividadesAcademicas": [],
            "ActividadesExtracurriculares": [],
            "HorasDisponibles": []
        }

        for entry in request.schedule:
            # Accedemos correctamente a los atributos de `ScheduleEntry`
            entry_dict = {
                "day": entry.day,
                "hour": entry.hour,
                "type": entry.type,
                "subject": entry.subject if entry.type == "academic" else None
            }

            if entry_dict["type"] == "academic":
                schedule_data["ActividadesAcademicas"].append(entry_dict)
            elif entry_dict["type"] == "extracurricular":
                schedule_data["ActividadesExtracurriculares"].append(entry_dict)
            elif entry_dict["type"] == "preferred":
                entry_dict.pop("subject", None)  # Eliminamos subject si es preferred
                schedule_data["HorasDisponibles"].append(entry_dict)

        # Guardar en MongoDB
        schedule_collection.insert_one(schedule_data)
        return {"message": "✅ Horario guardado correctamente en MongoDB"}

    except Exception as e:
        print(f"❌ Error en MongoDB: {e}")
        raise HTTPException(status_code=500, detail=f"Error al guardar en MongoDB: {str(e)}")


@app.get("/get-schedule/{user_id}")
async def get_schedule(user_id: int):
    """Obtener el horario del usuario desde MongoDB en la nueva estructura"""
    schedule_data = schedule_collection.find_one({"user_id": user_id}, {"_id": 0})
    return schedule_data  # ✅ Agrega esto para enviar los datos al frontend

    #if not schedule_data:
    #    return {
    #        "ActividadesAcademicas": [],
    #        "ActividadesExtracurriculares": [],
    #       "HorasDisponibles": []
    #    }

    #return schedule_data

# ================================
# ✅ OBTENER ACTIVIDADES DESDE MONGODB
# ================================
# ================================
# ✅ ENDPOINTS
# ================================

@app.get("/actividades-academicas")
async def obtener_actividades_academicas():
    """Obtener actividades académicas desde MongoDB"""
    actividades = list(activities_collection.find({"tipo": "academica"}, {"_id": 0}))
    return actividades

@app.get("/actividades-recomendadas")
async def obtener_actividades_recomendadas():
    """Obtener actividades recomendadas desde MongoDB"""
    actividades = list(activities_collection.find({"tipo": "recomendada"}, {"_id": 0}))
    return actividades

@app.post("/completar-actividad/{descripcion}")
async def completar_actividad(descripcion: str):
    """Marcar una actividad como completada en MongoDB"""
    result = activities_collection.update_one(
        {"descripcion": descripcion}, {"$set": {"estado": "completada"}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")

    return {"message": "✅ Actividad completada"}

# ================================
# ✅ OBTENER RECOMENDACIONES DESDE GEMINI AI
# ================================
# ================================
# ✅ GENERAR RECOMENDACIONES SIN GUARDAR EN MONGODB
# ================================
@app.post("/recomendaciones")
async def generar_recomendaciones(request: RecommendationRequest):
    """Generar recomendaciones basadas en el objetivo y horas disponibles con Gemini AI"""
    prompt = f"""
    Basado en el objetivo: "{request.objetivo}" y {request.horasDisponibles} horas disponibles, 
    recomienda una lista de actividades útiles y breves, separadas por saltos de línea.
    """

    headers = {"Authorization": f"Bearer {GEMINI_API_KEY}"}
    response = requests.post(GEMINI_URL, json={"prompt": prompt, "maxOutputTokens": 150}, headers=headers)

    if response.status_code == 200:
        data = response.json()
        recomendaciones = data.get("candidates", [])[0].get("output", "").strip().split("\n")

        if not recomendaciones or len(recomendaciones) == 0:
            return {"message": "⚠️ No se generaron recomendaciones. Inténtalo nuevamente.", "actividades": []}

        actividades = [{"tipo": "recomendada", "descripcion": rec, "horario": "pendiente"} for rec in recomendaciones]

        return {"message": "✅ Recomendaciones generadas con éxito", "actividades": actividades}
    else:
        raise HTTPException(status_code=500, detail="❌ Error al obtener recomendaciones de Gemini AI")

# ================================
# ✅ REGISTRO DE USUARIO
# ================================
@app.post("/register/")
def register(user: UserCreate, db: Session = Depends(get_db)):
    print(f"🔍 Registrando usuario: {user.username}, Email: {user.email}")

    existing_user = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El usuario o correo ya está registrado")

    hashed_password = pwd_context.hash(user.password)
    new_user = User(name=user.name, email=user.email, username=user.username, password=hashed_password)

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "Usuario registrado correctamente", "user_id": new_user.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al registrar usuario: {str(e)}")

# ================================
# ✅ INICIO DE SESIÓN
# ================================
@app.post("/login/")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter((User.username == user.user_input) | (User.email == user.user_input)).first()

    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    return {"message": "Inicio de sesión exitoso", "user_id": db_user.id, "username": db_user.username}

# ================================
# ✅ FOTO DE PERFIL
# ================================
@app.post("/update-photo/")
async def update_photo(user_id: int = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_data = await file.read()
    
    existing_photo = db.query(ProfilePicture).filter(ProfilePicture.user_id == user_id).first()
    if existing_photo:
        existing_photo.image = file_data
    else:
        new_photo = ProfilePicture(user_id=user_id, image=file_data)
        db.add(new_photo)

    db.commit()
    return {"message": "Foto de perfil actualizada correctamente"}

@app.get("/get-photo/{user_id}")
def get_photo(user_id: int, db: Session = Depends(get_db)):
    profile_picture = db.query(ProfilePicture).filter(ProfilePicture.user_id == user_id).first()
    
    if profile_picture:
        return {"image": base64.b64encode(profile_picture.image).decode("utf-8")}
    return {"message": "No hay imagen disponible"}

# ================================
# ✅ ACTUALIZAR CONTRASEÑA
# ================================
@app.post("/update-password/")
def update_password(data: PasswordUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == data.user_id).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    
    if not pwd_context.verify(data.current_password, db_user.password):
        raise HTTPException(status_code=401, detail="Contraseña actual incorrecta.")

    db_user.password = pwd_context.hash(data.new_password)
    db.commit()
    return {"message": "Contraseña actualizada correctamente."}
# ================================
# ✅ EJECUCIÓN DEL SERVIDOR
# ================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
