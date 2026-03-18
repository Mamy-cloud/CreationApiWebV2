from fastapi import APIRouter, HTTPException
from psycopg2 import sql

from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import request_update_row_postgre_sync
from app.postgreSql.synchrone.json_base_model.model_modify_value_row_postgre_sync import ModifyRowModelPostgreSync

router = APIRouter()


@router.put("/app/{schema_name}/{table_name}/postgre/synchrone/method_crud/modify/value_row")
def modify_row_endpoint_postgre_sync(
    schema_name: str,
    table_name: str,
    data: ModifyRowModelPostgreSync
):
    """
    Modifie une ligne dans une table PostgreSQL en utilisant schema_name et table_name
    passés dans l'URL.
    """

    conn = None
    cur = None

    try:
        # connexion à la base
        conn = postgre_sync_connect_to_db()
        cur = conn.cursor()

        # génération de la requête sécurisée
        query, values = request_update_row_postgre_sync(
            schema_name=schema_name,
            table_name=table_name,
            row_id=data.row_id,
            columns=[{"column_name": col.column_name, "new_value": col.new_value} for col in data.columns]
        )

        # debug
        print("Schema:", schema_name)
        print("Table:", table_name)
        print("Row ID:", data.row_id)
        print("Columns:", data.columns)
        print("SQL:", query)
        print("Values:", values)

        # exécution sécurisée
        cur.execute(query, values)

        # commit
        conn.commit()

        return {
            "message": "Ligne modifiée avec succès",
            "query_executed": query.as_string(cur)  # affiche la requête complète
        }

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la modification de la ligne : {str(e)}"
        )

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()