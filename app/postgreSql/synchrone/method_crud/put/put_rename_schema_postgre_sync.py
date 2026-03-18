from fastapi import APIRouter, HTTPException
from psycopg2 import sql

from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import request_rename_schema_postgre_sync
from app.postgreSql.synchrone.json_base_model.model_rename_schema_postgre_synchrone import RenameSchemaModelPostgre

router = APIRouter()

@router.put("/app/postgre/synchrone/method_crud/put/rename_schema")
def rename_schema_endpoint_postgre_sync(data: RenameSchemaModelPostgre):
    conn = postgre_sync_connect_to_db()
    
    try:
        old_name = data.schema_name
        new_name = data.new_schema_name

        # appel de ta fonction métier
        request_rename_schema_postgre_sync(conn, old_name, new_name)

        conn.commit()

        return {
            "message": "Schema renommé avec succès",
            "old_schema": old_name,
            "new_schema": new_name
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erreur : {str(e)}")

    finally:
        conn.close()