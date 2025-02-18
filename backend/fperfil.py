import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
import base64
import psycopg2
from psycopg2 import sql
from passlib.context import CryptContext
from dotenv import load_dotenv
from pydantic import BaseModel

# Cargar variables del .env
load_dotenv()

app = FastAPI()

# Configuración de la base de datos usando .env
DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASS"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT", "5433")
}

def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        print("✅ Conexión exitosa a la base de datos.")
        return conn
    except Exception as e:
        print(f"❌ Error al conectar a la base de datos: {e}")
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

# Configuración de encriptación de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class PasswordUpdate(BaseModel):
    user_id: int
    current_password: str
    new_password: str

# 🚀 **Actualizar o insertar foto de perfil**
@app.post("/update-photo/")
async def update_photo(user_id: int = Form(...), file: UploadFile = File(...)):
    try:
        file_data = await file.read()
        print(f"📸 Recibiendo imagen para el usuario ID {user_id}...")

        conn = get_db_connection()
        cur = conn.cursor()

        # Verificar si ya existe una foto
        cur.execute("SELECT id FROM profilePicture WHERE user_id = %s", (user_id,))
        result = cur.fetchone()
        print(f"🔍 Resultado de consulta de imagen: {result}")

        if result:
            cur.execute("UPDATE profilePicture SET image = %s WHERE user_id = %s", (file_data, user_id))
        else:
            cur.execute("INSERT INTO profilePicture (user_id, image) VALUES (%s, %s)", (user_id, file_data))

        conn.commit()
        cur.close()
        conn.close()

        print("✅ Foto de perfil guardada correctamente.")
        return {"message": "Foto de perfil actualizada correctamente"}
    except Exception as e:
        print(f"❌ Error al guardar la foto: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# 🚀 **Obtener la foto de perfil**
@app.get("/get-photo/{user_id}")
def get_photo(user_id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT image FROM profilePicture WHERE user_id = %s", (user_id,))
        result = cur.fetchone()
        cur.close()
        conn.close()

        if result and result[0]:
            print(f"✅ Imagen obtenida correctamente para usuario {user_id}")
            return {"image": base64.b64encode(result[0]).decode("utf-8")}
        print("❌ No hay imagen disponible.")
        return {"message": "No hay imagen disponible"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 🚀 **Actualizar contraseña con validación**
@app.post("/update-password/")
def update_password(data: PasswordUpdate):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        print(f"🔑 Verificando contraseña actual para usuario {data.user_id}...")

        # Verificar la contraseña actual
        cur.execute("SELECT password FROM users WHERE id = %s", (data.user_id,))
        result = cur.fetchone()

        if not result:
            print("❌ Usuario no encontrado en la base de datos.")
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        hashed_password = result[0]

        if not pwd_context.verify(data.current_password, hashed_password):
            print("❌ Contraseña actual incorrecta.")
            raise HTTPException(status_code=401, detail="Contraseña actual incorrecta")

        # Encriptar la nueva contraseña
        new_hashed_password = pwd_context.hash(data.new_password)

        # Actualizar la nueva contraseña en la base de datos
        cur.execute("UPDATE users SET password = %s WHERE id = %s", (new_hashed_password, data.user_id))
        conn.commit()
        cur.close()
        conn.close()

        print("✅ Contraseña actualizada correctamente.")
        return {"message": "Contraseña actualizada correctamente"}
    except Exception as e:
        print(f"❌ Error al actualizar la contraseña: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
