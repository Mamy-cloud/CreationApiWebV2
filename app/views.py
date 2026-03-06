from fastapi import APIRouter
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent


@router.get("/admin/tables")
async def get_table_page():
    file_path = BASE_DIR / "templates" / "tables.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)


@router.get("/admin/{schema_name}/{table_name}")
async def show_table_page(schema_name: str, table_name: str):
    file_path = BASE_DIR / "templates" / "tables_name.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)