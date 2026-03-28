# refresh_token_endpoint.py

from fastapi import APIRouter, Request, HTTPException
from app.postgreSql.protection_secure.refresh_token.GenerateRefreshTokenLogin import generate_refresh_token
from app.postgreSql.protection_secure.refresh_token.verify_refresh_token import verify_refresh_token

router = APIRouter()

@router.post("/refresh/token")
def refresh_token(request: Request):
    """
    Endpoint pour générer un nouveau access token à partir du refresh token stocké en httpOnly cookie.
    """
    # Récupération du refresh token depuis le cookie
    refresh_token_cookie = request.cookies.get("refresh_token")
    if not refresh_token_cookie:
        raise HTTPException(status_code=401, detail="Refresh token manquant")

    # Vérification et décodage du refresh token
    user_data = verify_refresh_token(refresh_token_cookie)
    if not user_data:
        raise HTTPException(status_code=401, detail="Refresh token invalide ou expiré")

    # Génération d'un nouveau access token
    access_token = generate_refresh_token(user_data)

    # Retour du nouveau token au front-end (JSON)
    return {"access_token": access_token, "token_type": "bearer"}