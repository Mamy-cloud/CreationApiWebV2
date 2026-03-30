# verify_refresh_token.py

from jose import jwt, JWTError  # python-jose
from fastapi import HTTPException, status
from datetime import datetime, timezone
from app.postgreSql.protection_secure.token_JWT.envToken import settings

def verify_refresh_token(token: str, check_expiration: bool = True) -> dict:
    """
    Vérifie un refresh token JWT.
    
    Args:
        token (str): le refresh token encodé
        check_expiration (bool): si True, vérifie la date d'expiration
    
    Returns:
        dict: les données utilisateur si le token est valide
    
    Raises:
        HTTPException 401 si le token est invalide ou expiré
    """
    try:
        # 🔹 Décodage avec algorithme défini
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]  # ex: "HS256"
        )

        # 🔹 Vérification explicite de l'expiration si demandé
        if check_expiration:
            exp = payload.get("exp")
            if exp is None or datetime.now(timezone.utc).timestamp() > exp:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Refresh token expiré"
                )

        # 🔹 Optionnel : vérifier blacklist ou token révoqué
        # if payload.get("jti") in BLACKLIST:
        #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token révoqué")

        return payload

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Refresh token invalide: {str(e)}"
        )