from fastapi import APIRouter, HTTPException
from psycopg2 import sql

from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.Request_PostgreSql import request_update_row_postgre_sync
from app.postgreSql.synchrone.json_base_model.model_modify_value_row_postgre_sync import ModifyValueRowModelPostgreSync

router = APIRouter()

@router.put("/app/postgre/synchrone/method_crud/modify/value_row")
def modify_row_endpoint_postgre_sync(data: ModifyValueRowModelPostgreSync):
    # debug
    print("debug data", data)
    print("debug dict", data.dict())

    conn = None
    cur = None

    try:
        # connexion à la base
        conn = postgre_sync_connect_to_db()
        cur = conn.cursor()

        # génération de la requête
        query, values = request_update_row_postgre_sync(
            schema_name=data.schema_name,
            table_name=data.table_name,
            row_id=data.row_id,
            columns=[{"column_name": col.column_name, "new_value": col.new_value} for col in data.columns]
        )

        print("schema back end:", data.schema_name)
        print("table back end:", data.table_name)
        print("id back end:", data.row_id)
        print("columns:", data.columns)
        print("sql créé:", query)
        print("valeurs:", values)

        # exécution sécurisée avec tuple de valeurs
        cur.execute(query, values)

        # validation
        conn.commit()

        return {
            "message": "Ligne modifiée avec succès",
            "query_executed": query.as_string(cur)  # affiche la requête SQL complète
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