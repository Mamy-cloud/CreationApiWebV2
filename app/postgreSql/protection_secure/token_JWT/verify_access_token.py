from fastapi import Request, HTTPException, status
from jose import jwt, JWTError
from app.postgreSql.protection_secure.token_JWT.envToken import settings

def verify_access_token(request: Request):
    """
    Vérifie le JWT stocké dans le cookie 'access_token'.
    Protège les routes où Depends(verify_access_token) est utilisé.
    """
    token = request.cookies.get("access_token")  # 🔹 lecture du cookie httpOnly
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        username = payload.get("username")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide"
            )

        return payload  # contient id, username, etc.

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré"
        )