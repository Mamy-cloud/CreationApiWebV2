from fastapi import Request, HTTPException, status
from jose import jwt, JWTError
from app.postgreSql.protection_secure.token_JWT.envToken import settings
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from psycopg2 import sql


def verify_access_token_in_middleware(request: Request):
    """
    Vérifie :
    - présence du token
    - validité JWT
    - présence en base PostgreSQL
    """

    # 🔹 1. Récupérer token depuis cookie
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Non authentifié"
        )

    try:
        # 🔹 2. Vérifier JWT
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload.get("id")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide"
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expiré ou invalide"
        )

    # 🔹 3. Vérifier en DB
    conn = None
    cur = None

    try:
        conn = postgre_sync_connect_to_db()
        cur = conn.cursor()

        query = sql.SQL("""
            SELECT 1
            FROM logout_schema.logout_table
            WHERE token = %s
            AND user_id = %s
            AND expires_at > NOW()
        """)

        cur.execute(query, (token, user_id))
        result = cur.fetchone()

        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token révoqué ou inexistant"
            )

        return payload  # utile si tu veux récupérer user

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()