from fastapi import APIRouter, HTTPException
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.request_create_api_key_db import (
    request_create_db_key_api_if_not_exist
)
import psycopg2

router = APIRouter()


@router.post("/create/db/api_key/postgre/sync")
def endpoint_create_db_key_api_if_not_exist():
    conn = None
    cur = None

    try:
        # 🔹 Connexion DB
        conn = postgre_sync_connect_to_db()
        cur = conn.cursor()

        # 🔹 Création schema + table
        request_create_db_key_api_if_not_exist(cur)

        conn.commit()

        return {
            "success": True,
            "message": "Schema et table api key vérifiés/créés avec succès"
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