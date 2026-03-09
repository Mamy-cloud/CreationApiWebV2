from fastapi import APIRouter, HTTPException
import psycopg2
from app.postgreSql.synchrone.json_base_model.model_rename_columns_postgre_sync import RenameColumnsModelPostgreSync
from app.postgreSql.synchrone.request.Request_PostgreSql import request_rename_columns_postgre_sync
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db

router = APIRouter()


@router.put("/app/postgre/sync/method/put/rename/colunm")
def rename_columns_endpoint_postgre_sync(data: RenameColumnsModelPostgreSync):
    """
    Endpoint PUT pour renommer une ou plusieurs colonnes d'une table PostgreSQL.
    
    Reçoit un JSON avec :
    {
        "schema_name": "...",
        "table_name": "...",
        "columns": [
            {"old_name_name": "...", "new_name": "..."},
            ...
        ]
    }
    """

    try:
        # Générer les requêtes SQL sécurisées
        rename_map = {col.old_name_name: col.new_name for col in data.columns}
        queries = request_rename_columns_postgre_sync(
            schema_name=data.schema_name,
            table_name=data.table_name,
            rename_map=rename_map
        )

        # Connexion et exécution
        conn = postgre_sync_connect_to_db()
        cursor = conn.cursor()

        for q in queries:
            cursor.execute(q)

        conn.commit()
        cursor.close()
        conn.close()

        return {
            "message": f"{len(queries)} colonne(s) renommée(s) avec succès",
            "queries_executed": queries
        }

    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))