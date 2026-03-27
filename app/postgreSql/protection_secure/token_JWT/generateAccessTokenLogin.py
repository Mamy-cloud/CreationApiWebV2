from datetime import datetime, timedelta, timezone
from jose import jwt

# 🔹 import settings
from app.postgreSql.protection_secure.token_JWT.envToken import settings


def generate_access_token_postgre(user_data: dict) -> str:
    """
    Génère un JWT après login valide
    """

    # 🔹 1. Préparer les données
    to_encode = user_data.copy()

    # 🔹 2. Ajouter expiration
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire,
        "sub": str(user_data.get("username"))
    })

    # 🔹 3. Encoder
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt