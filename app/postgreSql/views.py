from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from pathlib import Path
from fastapi import Query
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db


router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

#---------------------page d'accueil principal--------------
@router.get("/")
def read_root(db = Depends(postgre_sync_connect_to_db)):
    cursor = db.cursor()
    cursor.execute("SELECT 1")
    result = cursor.fetchone()[0]
    
    cursor.close()
    db.close()

    return {
        "message": "Connexion réussie avec psycopg2",
        "result": result
    }

#get schema table postgre
@router.get("/admin/method/get/tables/schema/postgresql/interface/views")
async def get_table_page_postgre():
    file_path = BASE_DIR / "templates" / "postgreFrontHtml"/ "method_crud" / "list_schema_table.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)

#get table/ rename table
@router.get("/admin/{schema_name}/{table_name}/postgresql/interface/views")
async def show_table_page_postgre(schema_name: str, table_name: str):
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "method_crud" / "display_table.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)

#create schema
@router.get("/admin/method/create/schema/postgresql/interface/views")
async def create_schema_page_postgre():
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "method_crud" / "create_schema.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)

#create table
@router.get("/admin/method/create/table/postgresql/interface/views")
async def create_table_page_postgre():
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "method_crud" / "create_table.html"

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
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "method_crud" / "rename_one_columns.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)

#renommer plusieur colonnes
@router.get("/admin/{schema_name}/{table_name}/postgresql/interface/views/modify_colonnes/rename_multi_column")
async def rename_multi_col_page_postgre(schema_name: str, table_name: str):
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "method_crud" / "rename_multi_columns.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)

#modifier une valeur de la ligne
@router.get("/admin/{schema_name}/{table_name}/postgresql/interface/views/modify_row/value")
async def modify_value_row_page_postgre(schema_name: str, table_name: str, id: int = Query(...)):
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "method_crud" / "modify_row.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)

#supprimer une colonne

@router.get("/admin/{schema_name}/{table_name}/postgresql/interface/views/modify_colonnes/delete_one_column")
async def rename_one_column_page_postgre(
    schema_name: str,
    table_name: str,
    column: str = Query(...),        # query parameter obligatoire
    type: str = Query(...)           # query parameter obligatoire
):
    file_path = BASE_DIR / "templates" / "postgreFrontHtml" / "method_crud" / "delete_one_column.html"

    if not file_path.exists():
        raise RuntimeError(f"Le fichier HTML n'existe pas : {file_path}")

    return FileResponse(file_path)