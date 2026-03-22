from fastapi import APIRouter, HTTPException
import psycopg2
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import request_post_add_row_postgre_sync
from app.postgreSql.synchrone.json_base_model.method_crud.model_add_row_postgre_sync import AddRowsModelPostgreSync

router = APIRouter()


@router.post("/app/{schema_name}/{table_name}/postgre/sync/method_crud/add/rows")
def add_row_endpoint_postgre_sync(
    schema_name: str,
    table_name: str,
    data: AddRowsModelPostgreSync
):
    """
    Ajoute une ou plusieurs lignes dans une table PostgreSQL
    en utilisant schema_name et table_name passés dans l'URL.
    """

    try:
        # Convertir le modèle en tuple compatible (columns, rows_as_lists)
        tuple_data = data.to_tuple()

        # Générer la requête SQL avec les noms du schema et de la table
        query = request_post_add_row_postgre_sync(
            schema_name=schema_name,
            table_name=table_name,
            tuple_data=tuple_data  # <-- ici
        )

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
            "schema": schema_name,
            "table": table_name,
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