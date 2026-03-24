from fastapi import APIRouter
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.request_postgre_login_signin_signup_sync import request_create_db_login_if_not_exist
import psycopg2

router = APIRouter()


@router.get("/check_db_login/if_not_exist/postgre/sync")
def init_db_if_not_exist():
    conn = None
    cur = None

    print("ouverture db pour le login")

    try:
        # 🔹 Connexion DB
        conn = postgre_sync_connect_to_db()
        cur = conn.cursor()

        print("lancement de la requête")
        # 🔹 Création schema + table si non existant
        created = request_create_db_login_if_not_exist(cur)

        print("creation or verification success")

        conn.commit()

        # 🔹 Réponse JSON directe
        return {
            "success": True,
            "created": created,
            "message": "DB créée" if created else "DB déjà existante"
        }

    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        return {
            "success": False,
            "error": f"PostgreSQL error: {str(e)}"
        }

    except Exception as e:
        if conn:
            conn.rollback()
        return {
            "success": False,
            "error": f"Server error: {str(e)}"
        }

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()