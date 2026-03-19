from fastapi import APIRouter, HTTPException
import psycopg2
from app.postgreSql.synchrone.json_base_model.model_delete_columns_postgre import ModelDeleteColumnsPostgre
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import request_delete_columns_postgre_sync
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db

router = APIRouter()


@router.delete("/app/{schema_name}/{table_name}/postgre/sync/method_crud/delete/one_multi_columns")
def endpoint_delete_columns_postgre_sync(
    schema_name: str,
    table_name: str,
    data: ModelDeleteColumnsPostgre
):
    """
    Endpoint pour supprimer une ou plusieurs colonnes d'une table PostgreSQL.
    """

    # 🔹 Vérification que la liste de colonnes n'est pas vide
    if not data.columns:
        raise HTTPException(
            status_code=400,
            detail="La liste des colonnes à supprimer ne peut pas être vide"
        )

    # 🔹 Génération de la requête SQL sécurisée
    try:
        query = request_delete_columns_postgre_sync(
            schema_name=schema_name,
            table_name=table_name,
            columns=data.columns
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la construction de la requête SQL: {e}")

    # 🔹 Exécution de la requête
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

    return {
        "message": f"Colonnes {data.columns} supprimées de la table '{table_name}' dans le schéma '{schema_name}' avec succès"
    }