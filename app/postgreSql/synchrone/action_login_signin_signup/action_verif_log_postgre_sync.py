from fastapi import APIRouter, HTTPException, Response
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.request_postgre_login_signin_signup_sync import request_verify_log_postgre_sync
from app.postgreSql.synchrone.json_base_model.login_signup.model_verify_log_postgre import ModelVerifyLogPostgre
from app.postgreSql.protection_secure.token_JWT.generateAccessTokenLogin import generate_access_token_postgre
import psycopg2

router = APIRouter()


@router.post("/verif/login/db/postgre/sync")
def endpoint_verif_log_postgre(data: ModelVerifyLogPostgre, response: Response):
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

        # 🔐 Vérification sécurisée
        success, db_user = request_verify_log_postgre_sync(
            cursor,
            data.username,
            data.password_hash
        )

        cursor.close()
        conn.close()

        if success:
            # ✅ Génération du token
            token = generate_access_token_postgre({
                "id": None,               # ou récupérer depuis la DB si possible
                "username": data.username
            })

            # 🔹 Stockage du token dans cookie httpOnly pour le front-end
            response.set_cookie(
                key="access_token",
                value=token,
                httponly=True,          # empêche l'accès via JS
                samesite="strict",      # protection CSRF
                secure=True             # obligatoire HTTPS (mettre False en dev local si pas HTTPS)
            )

            return {
                "success": True,
                "message": "Connexion réussie",
                "token_type": "bearer"
            }

        # 🔒 Si échec
        return {
            "success": False,
            "message": "Identifiants invalides, créez un compte"
        }

    except psycopg2.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur base de données: {str(e)}"
        )