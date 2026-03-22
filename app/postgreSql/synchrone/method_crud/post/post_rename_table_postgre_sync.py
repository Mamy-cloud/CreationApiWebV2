from fastapi import APIRouter, HTTPException
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import request_post_rename_table_postgre_sync
from app.postgreSql.synchrone.json_base_model.method_crud.model_rename_table_postgre_sync import RenameTableModelPostgreSync

router = APIRouter()


@router.post("/app/{schema_name}/{table_name}/postgre/synchrone/method/crud/post/rename_table")
def rename_table_endpoint_postgre_sync(
    schema_name: str,
    table_name: str,
    data: RenameTableModelPostgreSync
):
    """
    Renomme une table PostgreSQL
    - schema_name : dans l'URL
    - table_name : ancien nom (dans l'URL)
    - new_name : dans le body
    """

    try:
        conn = postgre_sync_connect_to_db()
        cursor = conn.cursor()

        query = request_post_rename_table_postgre_sync(
            schema_name,
            table_name,      # ancien nom
            data.new_name    # nouveau nom
        )

        cursor.execute(query)
        conn.commit()

        cursor.close()
        conn.close()

        return {
            "message": "Table renommée avec succès",
            "schema": schema_name,
            "old_table": table_name,
            "new_table": data.new_name
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))