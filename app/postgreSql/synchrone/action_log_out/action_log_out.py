from fastapi import APIRouter, HTTPException, Response, Request
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.request_log_out_postgre_sync import request_delete_token_logout
import psycopg2

router = APIRouter()


@router.post("/logout/from/session/postgre/sync")
def logout(request: Request, response: Response):
    """
    Endpoint de déconnexion :
    - Supprime le token en DB (blacklist implicite)
    - Supprime les cookies côté client
    """

    try:
        # 🔹 Récupération du user_id depuis le cookie
        user_id = request.cookies.get("user_id")

        if not user_id:
            raise HTTPException(status_code=401, detail="user_id manquant")

        try:
            user_id = int(user_id)
        except ValueError:
            raise HTTPException(status_code=401, detail="user_id invalide")

        # 🔹 Connexion DB
        conn = postgre_sync_connect_to_db()
        cursor = conn.cursor()

        # 🔹 Suppression du token (blacklist implicite)
        request_delete_token_logout(user_id, cursor, conn)

        cursor.close()
        conn.close()

        # 🔹 Suppression des cookies côté client
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        response.delete_cookie("user_id")

        return {
            "success": True,
            "message": "Déconnexion réussie"
        }

    except psycopg2.Error as e:
        if 'conn' in locals():
            conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Erreur base de données: {str(e)}"
        )

    except Exception as e:
        if 'conn' in locals():
            conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Erreur serveur: {str(e)}"
        )