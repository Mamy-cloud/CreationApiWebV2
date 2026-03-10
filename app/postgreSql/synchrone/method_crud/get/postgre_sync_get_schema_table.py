from fastapi import APIRouter, HTTPException
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import postgre_sync_get_schema_table

router = APIRouter()

@router.get("/app/postgre/sync/method_crud/get/schema_table")
def postgre_sync_endpoint_get_schema_table():
    conn = None
    cursor = None
    try:
        conn = postgre_sync_connect_to_db()
        cursor = conn.cursor()
        result = postgre_sync_get_schema_table(cursor)
        return result  # renvoie directement le JSON attendu
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()