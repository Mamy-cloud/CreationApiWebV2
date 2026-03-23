from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from pathlib import Path
from fastapi import Query
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db


router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent

#------------------------------receive .env-----------------
@router.get("/receive_env/views/app/postgre")
async def get_table_page_postgre():
    file_path = BASE_DIR / "templates" / "postgreFrontHtml"/ "receive_env" / "views_receive_env_postgre.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)