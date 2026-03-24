from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from pathlib import Path
from fastapi import Query

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent


#get schema table postgre
@router.get("/admin/login/sigin/creation/add/password/postgresql/sync/interface/views")
async def get_table_page_postgre():
    file_path = BASE_DIR / "templates" / "postgreFrontHtml"/ "login_signin_signup" / "views_login_signin.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)