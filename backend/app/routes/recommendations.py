from fastapi import APIRouter

router = APIRouter()

@router.get("/recommendations", summary="Obtener recomendaciones", description="Este endpoint devuelve recomendaciones personalizadas para los estudiantes.")
async def get_recommendations():
    return {"message": "Aquí van las recomendaciones"}
