from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_routines():
    return {"message": "List of daily routines"}
