# refresh_token_endpoint.py

from fastapi import APIRouter, Request, Response, HTTPException
from app.postgreSql.protection_secure.token_JWT.generateAccessTokenLogin import generate_access_token_postgre
from app.postgreSql.protection_secure.refresh_token.verify_refresh_token import verify_refresh_token
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.request_log_out_postgre_sync import update_access_token_in_db
from datetime import datetime, timedelta, timezone

router = APIRouter()

LEAWAY_SECONDS = 10  # tolérance pour décalage réseau

@router.post("/refresh/token")
def refresh_token(request: Request, response: Response):
    """
    Génère un nouveau access token à partir du refresh token stocké en httpOnly cookie.
    Supprime tous les anciens tokens de l'utilisateur et insère le nouveau.
    Renvoie l'expiration du token pour un refresh anticipé côté front-end.
    """
    # 🔹 Récupération du refresh token depuis le cookie
    refresh_token_cookie = request.cookies.get("refresh_token")
    if not refresh_token_cookie:
        raise HTTPException(status_code=401, detail="Refresh token manquant, veuillez-vous connecter")

    # 🔹 Vérification du refresh token
    user_data = verify_refresh_token(refresh_token_cookie)
    if not user_data:
        raise HTTPException(status_code=401, detail="Refresh token invalide ou expiré, veuillez-vous connecter")

    # 🔹 Génération d'un nouveau access token
    access_token = generate_access_token_postgre(user_data)

    # 🔹 Connexion à la DB pour mise à jour
    conn = postgre_sync_connect_to_db()
    cur = conn.cursor()

    # 🔹 Calcul de l'expiration du token avec un leeway
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15, seconds=LEAWAY_SECONDS)

    # 🔹 Supprime les anciens tokens et insère le nouveau
    update_access_token_in_db(user_data["id"], access_token, cur, conn, expires_at)

    cur.close()
    conn.close()

    # 🔹 Stockage du token dans le cookie httpOnly
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="strict",
        secure=True  # mettre False si HTTP local
    )

    # 🔹 Retour JSON avec expiration pour le front-end
    return {
        "success": True,
        "message": "Nouveau access token généré",
        "access_token": access_token,
        "expires_at": expires_at.isoformat(),  # format ISO 8601 UTC
        "token_type": "bearer"
    }