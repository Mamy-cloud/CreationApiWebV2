# get_table.py
from fastapi import APIRouter, HTTPException
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import request_get_table_PostgreSql_sync_safe
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
import psycopg2
import psycopg2.extras

router = APIRouter()

@router.get("/app/{schema_name}/{table_name}/methods/get/get_table/postgresql/json")
def get_table_postgre_sync(schema_name: str, table_name: str):
    """
    Retourne le JSON complet d'une table PostgreSQL dans le format attendu :
    {
        "table": "<table_name>",
        "columns": [{"name": "...", "type": "..."}, ...],
        "rows": [{...}, {...}, ...]
    }
    """
    conn = None
    try:
        conn = postgre_sync_connect_to_db()
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:

            # Récupérer les requêtes sécurisées pour le schéma et la table
            columns_query, rows_query = request_get_table_PostgreSql_sync_safe(schema_name, table_name)

            # Colonnes
            cur.execute(columns_query)
            columns_result = cur.fetchall()
            columns = [{"name": col["column_name"], "type": col["data_type"]} for col in columns_result]

            if not columns:
                raise HTTPException(status_code=404, detail=f"Aucune colonne trouvée pour la table {schema_name}.{table_name}")

            # Lignes
            cur.execute(rows_query)
            rows_result = cur.fetchall()  # chaque ligne est un dict

            # Retourner le JSON final
            return {
                "table": table_name,
                "columns": columns,
                "rows": rows_result
            }

    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur PostgreSQL : {e}")
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    finally:
        if conn:
            conn.close()