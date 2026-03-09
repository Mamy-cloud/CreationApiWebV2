from fastapi import APIRouter, HTTPException
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.json_base_model.postgre_sync_model_create_schema import PostgreSyncSchemaCreate
from app.postgreSql.synchrone.request.Request_PostgreSql import postgre_sync_request_create_schema_query

router = APIRouter()

@router.post("/app/postgre/sync/method/post/schema")
def postgre_post_create_schema(schema: PostgreSyncSchemaCreate):
    conn = None
    cursor = None
    
    try:
        # Connexion à la base
        conn = postgre_sync_connect_to_db()
        cursor = conn.cursor()

        # Génération requête sécurisée
        query = postgre_sync_request_create_schema_query(schema.schema_name)

        # Exécution
        cursor.execute(query)

        # Commit obligatoire
        conn.commit()

        return {
            "message": f"Schema '{schema.schema_name}' créé avec succès."
        }

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la création du schema : {str(e)}"
        )

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()