from fastapi import APIRouter, HTTPException
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.request_postgre_login_signin_signup_sync import request_verify_log_postgre_sync
from app.postgreSql.synchrone.json_base_model.login_signup.model_verify_log_postgre import ModelVerifyLogPostgre
import psycopg2

router = APIRouter()


@router.post("/verif/login/db/postgre/sync")
def endpoint_verif_log_postgre(data: ModelVerifyLogPostgre):
    """
    Endpoint de vérification des identifiants utilisateur.
    Anti-hack : ne révèle jamais si l'utilisateur existe ou non.
    """
    print("json reçu et base model : ", data)
    try:
        # Connexion à la base PostgreSQL
        conn = postgre_sync_connect_to_db()
        cursor = conn.cursor()
        print("connexion db ouverte")
        # 🔐 Appel de la fonction sécurisée
        success, message = request_verify_log_postgre_sync(
            cursor,
            data.username,
            data.password_hash
        )

        cursor.close()
        conn.close()

        # Retour JSON pour le front-end
        return {"success": success, "message": message}

    except psycopg2.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur base de données: {str(e)}"
        )