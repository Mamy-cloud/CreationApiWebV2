from fastapi import Request, HTTPException, status
from fastapi.responses import RedirectResponse
from jose import jwt, JWTError
from app.postgreSql.protection_secure.token_JWT.envToken import settings


def verify_access_token(request: Request, redirect_if_invalid: bool = False):
    """
    Vérifie le JWT stocké dans le cookie 'access_token'.
    
    Paramètres:
        request: Request FastAPI
        redirect_if_invalid: si True, redirige vers /login au lieu de renvoyer 401
    
    Retour:
        payload du token (dict)
    
    Utilisation:
        @app.get("/protected")
        def protected_route(user=Depends(verify_access_token)):
            ...
    """
    token = request.cookies.get("access_token")  # 🔹 lecture du cookie httpOnly
    if not token:
        if redirect_if_invalid:
            return RedirectResponse(url="/verif/login/db/postgre/sync")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Non authentifié"
        )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        username = payload.get("username")
        if not username:
            if redirect_if_invalid:
                return RedirectResponse(url="/verif/login/db/postgre/sync")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide"
            )

        # 🔹 Optionnel: on peut ajouter ici d'autres vérifications,
        # ex: vérification blacklist ou rôle utilisateur
        # ex: if payload.get("role") != "admin": ...

        return payload

    except JWTError:
        if redirect_if_invalid:
            return RedirectResponse(url="/verif/login/db/postgre/sync")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré"
        )