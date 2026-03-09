from fastapi import APIRouter, HTTPException
import psycopg2
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.Request_PostgreSql import request_post_add_row_postgre_sync
from app.postgreSql.synchrone.json_base_model.model_add_row_postgre_sync import AddRowsModelPostgreSync

router = APIRouter()


@router.post("/app/postgre/sync/method_crud/add/rows/")
def add_row_endpoint_postgre_sync(data: AddRowsModelPostgreSync):
    """
    Ajoute une ou plusieurs lignes dans une table PostgreSQL
    en utilisant schema_name.
    """

    try:
        # Convertir le modèle en tuple compatible
        tuple_data = data.to_tuple()

        # Générer la requête SQL
        query = request_post_add_row_postgre_sync(tuple_data)

        # Connexion à la base
        conn = postgre_sync_connect_to_db()
        cursor = conn.cursor()

        # Exécuter la requête
        cursor.execute(query)

        # Commit
        conn.commit()

        cursor.close()
        conn.close()

        return {
            "message": "Row(s) inserted successfully",
            "schema": data.schema_name,
            "table": data.table_name,
            "rows_inserted": len(data.rows)
        }

    except psycopg2.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error: {str(e)}"
        )