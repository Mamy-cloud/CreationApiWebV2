from fastapi import APIRouter, HTTPException
import psycopg2
from app.postgreSql.synchrone.json_base_model.model_delete_row_id_postgre_sync import ModelDeleteRowPostgre
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import request_delete_row_id
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db

router = APIRouter()

@router.delete("/app/{schema_name}/{table_name}/postgre/sync/method_crud/delete/row/id")
def endpoint_delete_row_postgre_sync(
    schema_name: str,
    table_name: str,
    data: ModelDeleteRowPostgre
):
    print("JSON reçu et BaseModel:", data)

    # 🔹 Génération de la requête SQL sécurisée
    try:
        query, param = request_delete_row_id(
            schema_name=schema_name,
            table_name=table_name,
            row_id=data.row_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la construction de la requête SQL: {e}")

    print("SQL créé:", query.as_string(None), "avec paramètre row_id =", param)

    # 🔹 Exécution de la requête
    try:
        conn = postgre_sync_connect_to_db()
        with conn.cursor() as cur:
            cur.execute(query, (param,))
        conn.commit()
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur PostgreSQL: {e.pgerror}")
    finally:
        if conn:
            conn.close()

    print("Suppression effectuée")
    return {
        "message": f"Ligne avec id {data.row_id} supprimée de la table '{table_name}' dans le schéma '{schema_name}' avec succès"
    }