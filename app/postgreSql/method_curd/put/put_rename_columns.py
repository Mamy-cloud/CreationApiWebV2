from fastapi import APIRouter, HTTPException
import psycopg2
from app.postgreSql.json_base_model.rename_columns import RenameColumnsRequest
from app.postgreSql.request.Request_PostgreSql import generate_rename_columns_queries
from app.postgreSql.connexion_db.db_PostgreSql_web import connect_to_db

router = APIRouter()


@router.put("/admin/method/table/rename_columns")
def rename_columns_endpoint(data: RenameColumnsRequest):
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
        queries = generate_rename_columns_queries(
            schema_name=data.schema_name,
            table_name=data.table_name,
            rename_map=rename_map
        )

        # Connexion et exécution
        conn = connect_to_db()
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