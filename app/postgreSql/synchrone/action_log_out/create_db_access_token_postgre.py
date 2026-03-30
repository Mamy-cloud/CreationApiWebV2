from fastapi import APIRouter, HTTPException
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.request_log_out_postgre_sync import (
    request_create_table_accesstoken_logout_if_not_exist
)
import psycopg2

router = APIRouter()


@router.post("/check_db_accesstoken/logout/postgre/sync")
def endpoint_table_accesstoken_if_not_exist():
    conn = None
    cur = None

    try:
        # 🔹 Connexion DB
        conn = postgre_sync_connect_to_db()
        cur = conn.cursor()

        # 🔹 Création schema + table
        request_create_table_accesstoken_logout_if_not_exist(cur)

        conn.commit()

        return {
            "success": True,
            "message": "Schema et table vérifiés/créés avec succès"
        }

    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"PostgreSQL error: {str(e)}"
        )

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Server error: {str(e)}"
        )

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()