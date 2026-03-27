# verify_refresh_token.py

from authlib.jose import jwt, JoseError
from fastapi import HTTPException
from datetime import datetime, timezone
from app.postgreSql.protection_secure.token_JWT.envToken import settings

def verify_refresh_token(token: str) -> dict:
    """
    Vérifie un refresh token JWT.
    
    Args:
        token (str): le refresh token encodé

    Returns:
        dict: les données utilisateur si le token est valide
    
    Raises:
        HTTPException 401 si le token est invalide ou expiré
    """
    try:
        # Décodage du token
        claims = jwt.decode(token, settings.SECRET_KEY)
        claims.validate()  # Vérifie exp, nbf, iat si présents

        # Vérification expiration explicite (timestamp UTC)
        exp = claims.get("exp")
        if exp is None or datetime.now(timezone.utc).timestamp() > exp:
            raise HTTPException(status_code=401, detail="Refresh token expiré")

        return dict(claims)

    except JoseError:
        raise HTTPException(status_code=401, detail="Refresh token invalide")