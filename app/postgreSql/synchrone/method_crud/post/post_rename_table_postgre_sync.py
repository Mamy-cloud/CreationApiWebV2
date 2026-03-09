from fastapi import APIRouter, HTTPException
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import request_post_rename_table_postgre_sync
from app.postgreSql.synchrone.json_base_model.model_rename_table_postgre_sync import RenameTableModelPostgreSync

router = APIRouter()


@router.post("/app/postgre/synchrone/method/crud/post/rename_table")
def rename_table_endpoint_postgre_sync(data: RenameTableModelPostgreSync):

    try:
        conn = postgre_sync_connect_to_db()
        cursor = conn.cursor()

        query = request_post_rename_table_postgre_sync(
            data.schema_name,
            data.old_name,
            data.new_name
        )

        cursor.execute(query)
        conn.commit()

        cursor.close()
        conn.close()

        return {"message": "Table renommée avec succès"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))