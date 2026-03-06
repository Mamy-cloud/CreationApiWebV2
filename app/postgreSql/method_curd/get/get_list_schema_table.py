from fastapi import APIRouter, HTTPException
from app.postgreSql.connexion_db.db_PostgreSql_web import connect_to_db
from app.postgreSql.request.Request_PostgreSql import get_schema_table

router = APIRouter()

@router.get("/admin/get_schema/list/json")
def read_schema_table():
    conn = None
    cursor = None
    try:
        conn = connect_to_db()
        cursor = conn.cursor()
        result = get_schema_table(cursor)
        return result  # renvoie directement le JSON attendu
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()