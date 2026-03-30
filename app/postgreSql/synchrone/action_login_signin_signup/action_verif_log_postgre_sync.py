from fastapi import APIRouter, HTTPException, Response
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.request_postgre_login_signin_signup_sync import request_verify_log_postgre_sync
from app.postgreSql.protection_secure.token_JWT.generateAccessTokenLogin import generate_access_token_postgre
from app.postgreSql.protection_secure.refresh_token.GenerateRefreshTokenLogin import generate_refresh_token
from app.postgreSql.synchrone.request.request_log_out_postgre_sync import request_insert_access_token_to_db
from app.postgreSql.synchrone.json_base_model.login_signup.model_verify_log_postgre import ModelVerifyLogPostgre
import psycopg2

router = APIRouter()


@router.post("/verif/login/db/postgre/sync")
def endpoint_verif_log_postgre(data: ModelVerifyLogPostgre, response: Response):
    """
    Endpoint de vérification des identifiants utilisateur.
    Anti-hack : ne révèle jamais si l'utilisateur existe ou non.
    """
    try:
        # 🔹 Connexion à la DB
        conn = postgre_sync_connect_to_db()
        cursor = conn.cursor()

        # 🔐 Vérification sécurisée
        success, db_user, message = request_verify_log_postgre_sync(
            cursor,
            data.username,
            data.password_hash
        )

        if success and db_user:
            user_id = db_user["id"]
            username = db_user["username"]

            # ✅ Génération des tokens
            access_token = generate_access_token_postgre({
                "id": user_id,
                "username": username
            })

            refresh_token = generate_refresh_token({
                "id": user_id,
                "username": username
            })

            # 🔹 Insérer l'access token dans la table logout_table
            request_insert_access_token_to_db(cursor, access_token, user_id)
            conn.commit()  # commit après insertion

            # 🔹 Stockage des tokens dans cookies httpOnly pour le front-end
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                samesite="strict",
                secure=False  # True en prod HTTPS, False en dev local
            )
            # Stockage du refresh_token
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                samesite="strict",
                secure=False  # True en prod HTTPS, False en dev local
            )

            # Stockage du user_id dans un cookie séparé
            response.set_cookie(
                key="user_id",
                value=str(user_id),  # convertir int en string pour le cookie
                httponly=True,
                samesite="strict",
                secure=False  # True en prod HTTPS
            )

            cursor.close()
            conn.close()

            return {
                "success": True,
                "message": message,
                "token_type": "bearer"
            }

        # 🔒 Si échec
        cursor.close()
        conn.close()
        return {
            "success": False,
            "message": message
        }

    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Erreur base de données: {str(e)}"
        )

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Erreur serveur: {str(e)}"
        )