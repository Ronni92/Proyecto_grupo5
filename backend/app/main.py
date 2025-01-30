from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

# 🔹 Importar las rutas correctamente
from app.routes import auth, recommendations, routines  # Asegúrate de que estas rutas existen en app/routes/

app = FastAPI(
    title="Schedule AI API",
    description="API for automated student scheduling using AI",
    version="1.0",
    docs_url="/docs",  
    redoc_url="/redoc"
)

# 🔹 Configuración de CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Cambia esto por la URL de tu frontend en producción
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permite todos los headers
)

# 🔹 Incluir rutas (después de importarlas correctamente)
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
app.include_router(routines.router, prefix="/routines", tags=["Routines"])

@app.get("/")
def home():
    return {"message": "Welcome to Schedule AI API"}
