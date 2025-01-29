from fastapi import APIRouter

router = APIRouter()
@router.get("/")
def get_recommendations():
    return {"message": "AI-based recommendations will be here"}
