from datetime import datetime, timezone, timedelta
from authlib.jose import jwt
from app.postgreSql.protection_secure.token_JWT.envToken import settings

def generate_refresh_token(data: dict) -> str:
    header = {"alg": settings.ALGORITHM}
    
    payload = data.copy()
    # Utilisation de datetime aware UTC
    payload["exp"] = int((datetime.now(timezone.utc) + timedelta(days=7)).timestamp())
    
    token = jwt.encode(header, payload, settings.SECRET_KEY)
    return token.decode("utf-8") if isinstance(token, bytes) else token