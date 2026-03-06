from fastapi import APIRouter, HTTPException
from app.postgreSql.connexion_db.db_PostgreSql_web import connect_to_db
from app.postgreSql.json_base_model.create_schema_model import SchemaCreate
from app.postgreSql.request.Request_PostgreSql import create_schema_query

router = APIRouter()

@router.post("/admin/create_schema")
def create_schema(schema: SchemaCreate):
    conn = None
    cursor = None
    
    try:
        # Connexion à la base
        conn = connect_to_db()
        cursor = conn.cursor()

        # Génération requête sécurisée
        query = create_schema_query(schema.schema_name)

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