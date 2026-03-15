from fastapi import APIRouter
from fastapi.responses import FileResponse
from pathlib import Path
from fastapi import Query

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent

#get schema table postgre
@router.get("/admin/method/get/tables/schema/postgresql/interface/views")
async def get_table_page_postgre():
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "list_schema_table.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)

#get table/ rename table
@router.get("/admin/{schema_name}/{table_name}/postgresql/interface/views")
async def show_table_page_postgre(schema_name: str, table_name: str):
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "display_table.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)

#create schema
@router.get("/admin/method/create/schema/postgresql/interface/views")
async def create_schema_page_postgre():
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "create_schema.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)

#create table
@router.get("/admin/method/create/table/postgresql/interface/views")
async def create_table_page_postgre():
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "create_table.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)

#renommer une colonne
@router.get("/admin/{schema_name}/{table_name}/postgresql/interface/views/modify_colonnes/rename_one_column")
async def rename_one_column_page_postgre(
    schema_name: str,
    table_name: str,
    column: str = Query(...),        # query parameter obligatoire
    type: str = Query(...)           # query parameter obligatoire
):
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "rename_one_columns.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)

#renommer plusieur colonnes
@router.get("/admin/{schema_name}/{table_name}/postgresql/interface/views/modify_colonnes/rename_multi_column")
async def rename_multi_col_page_postgre(schema_name: str, table_name: str):
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "rename_multi_columns.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)

#modifier une valeur de la ligne
@router.get("/admin/{schema_name}/{table_name}/postgresql/interface/views/modify_row/value")
async def modify_value_row_page_postgre(schema_name: str, table_name: str, id: int = Query(...)):
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "modify_row.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)