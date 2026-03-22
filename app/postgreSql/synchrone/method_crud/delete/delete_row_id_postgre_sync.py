from fastapi import APIRouter, HTTPException, Body
import psycopg2
from app.postgreSql.synchrone.json_base_model.method_crud.model_delete_row_id_postgre_sync import ModelDeleteRowPostgre
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import request_delete_row_id_postgre
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db

router = APIRouter()

@router.delete("/app/{schema_name}/{table_name}/postgre/sync/method_crud/delete/row/id")
def endpoint_delete_row_postgre_sync(
    schema_name: str,
    table_name: str,
    data: ModelDeleteRowPostgre = Body(...)
):
    print("base Model et json reçu:", data, "/schema name:", schema_name, "/nom table", table_name)
    """
    Supprime une ligne par ID dans PostgreSQL.
    """

    # 🔹 Génération de la requête sécurisée
    try:
        query, param = request_delete_row_id_postgre(
            schema_name=schema_name,
            table_name=table_name,
            row_id=data.row_id
        )
        print("SQL créé:", query, "//avec paramètre row_id =", param)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur construction requête SQL: {e}")

    # 🔹 Exécution de la requête
    try:
        conn = postgre_sync_connect_to_db()
        with conn.cursor() as cur:
            cur.execute(query, param)
        conn.commit()
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur PostgreSQL: {e.pgerror}")
    finally:
        if conn:
            conn.close()

    return {
        "message": f"Ligne {data.row_id} supprimée de la table '{table_name}' dans le schéma '{schema_name}'"
    }