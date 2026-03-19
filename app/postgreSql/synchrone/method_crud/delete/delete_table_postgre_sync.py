from fastapi import APIRouter, HTTPException
import psycopg2
from app.postgreSql.synchrone.json_base_model.model_delete_table_postgre import DeleteTablePostgre
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import request_delete_table_postgre_sync
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db

router = APIRouter()


@router.delete("/app/{schema_name}/{table_name}/postgre/sync/method_crud/delete/table")
def endpoint_delete_table_postgre_sync(
    schema_name: str,
    table_name: str,
    data: DeleteTablePostgre
):

    print("json reçu et base model: ", data)
    # Vérification cohérence URL / JSON
    if schema_name != data.schema_name or table_name != data.table_name:
        raise HTTPException(
            status_code=400,
            detail="Les noms du schéma et de la table dans l'URL doivent correspondre à ceux du JSON"
        )
    print("nom du schema et table", schema_name, table_name)

    # Construire la requête SQL sécurisée
    try:
        query = request_delete_table_postgre_sync(schema_name=data.schema_name, table_name=data.table_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la construction de la requête SQL: {e}")

    print("sql reçu", query)
    # Connexion à la base et exécution
    try:
        conn = postgre_sync_connect_to_db()
        with conn.cursor() as cur:
            cur.execute(query)
        conn.commit()
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur PostgreSQL: {e.pgerror}")
    finally:
        if conn:
            conn.close()

    return {"message": f"Table '{table_name}' dans le schéma '{schema_name}' supprimée avec succès"}