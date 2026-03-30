from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from pathlib import Path
from fastapi import Query
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.protection_secure.token_JWT.verify_access_token_in_middleware import verify_access_token_in_middleware
from app.postgreSql.protection_secure.token_JWT.verify_access_token import verify_access_token

router = APIRouter(dependencies=[Depends(verify_access_token)])



BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent


#profile
@router.get("/admin/profile/postgresql/interface/views")
async def get_table_page_postgre():
    file_path = BASE_DIR / "templates" / "postgreFrontHtml"/ "profile" / "profile_postgre.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)
