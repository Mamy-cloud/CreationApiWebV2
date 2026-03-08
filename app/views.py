from fastapi import APIRouter
from fastapi.responses import FileResponse
from pathlib import Path
from fastapi import Query

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



@router.get("/admin/{schema_name}/{table_name}/modify_colonnes/rename_one_column")
async def show_table_page(
    schema_name: str,
    table_name: str,
    column: str = Query(...),        # query parameter obligatoire
    type: str = Query(...)           # query parameter obligatoire
):
    file_path = BASE_DIR / "templates" / "rename_one_columns.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)

@router.get("/admin/{schema_name}/{table_name}/modify_colonnes/rename_multi_column")
async def show_table_page(schema_name: str, table_name: str):
    file_path = BASE_DIR / "templates" / "rename_multi_columns.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)


@router.get("/admin/{schema_name}/{table_name}/modify_row/value")
async def show_table_page(schema_name: str, table_name: str, id: int = Query(...)):
    file_path = BASE_DIR / "templates" / "modify_row.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)