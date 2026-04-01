from fastapi import APIRouter, Request, Response, HTTPException
from app.postgreSql.protection_secure.api_key.generate_api_key import generate_hashed_api_key
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.request_create_api_key_db import insert_api_key_if_not_exist
from datetime import datetime, timedelta, timezone
from starlette.responses import JSONResponse

router = APIRouter()

@router.post("/create/api_key/hashed/postgre/sync")
def endpoint_create_hashed_key_api_if_not_exist(request: Request):
    """
    Endpoint pour créer une clé API hashée si elle n'existe pas pour l'utilisateur.
    Récupère le user_id depuis les cookies.
    """
    # 🔹 Récupérer le user_id depuis les cookies
    user_id = request.cookies.get("user_id")
    
    if not user_id:
        raise HTTPException(status_code=400, detail="Cookie 'user_id' manquant")
    
    try:
        user_id = int(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="user_id invalide")

    # 🔹 Connexion à la base PostgreSQL
    conn = postgre_sync_connect_to_db()
    cur = conn.cursor()
    
    try:
        # 🔹 Générer le hash de la clé API
        api_key_hash = generate_hashed_api_key()
        
        # 🔹 Insérer la clé si elle n'existe pas
        already_exists = insert_api_key_if_not_exist(cur, conn, user_id, api_key_hash)
        
        if already_exists:
            return JSONResponse(
                status_code=200,
                content={"message": "Clé API déjà existante pour cet utilisateur"}
            )
        else:
            return JSONResponse(
                status_code=201,
                content={
                    "message": "Nouvelle clé API créée",
                    "api_key_hash": api_key_hash  # ⚠️ Ne pas retourner la clé en clair
                }
            )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": f"Erreur lors de la création de la clé API : {str(e)}"}
        )
    finally:
        cur.close()
        conn.close()