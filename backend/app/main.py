from fastapi import FastAPI
from app.routes import auth, recommendations, routines

app = FastAPI(
    title="Schedule AI API",
    description="API for automated student scheduling using AI",
    version="1.0",
    docs_url="/docs",  # 🔴 Asegura que esta línea está presente
    redoc_url="/redoc"
)

# Incluir rutas
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
app.include_router(routines.router, prefix="/routines", tags=["Routines"])

@app.get("/")
def home():
    return {"message": "Welcome to Schedule AI API"}
