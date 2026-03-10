#cet endpoint est utilisé pour uptime robot ou autre appli qui fera un appel api get pour éviter la mise en veille du serveur

from fastapi import APIRouter


router = APIRouter()

@router.get("/app/global/sync/async/method/get/bonjour")
def get_bonjour():
    return {"bonjour": "get"}