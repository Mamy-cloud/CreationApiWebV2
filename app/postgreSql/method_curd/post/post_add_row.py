from fastapi import APIRouter, HTTPException
import psycopg2
from app.postgreSql.connexion_db.db_PostgreSql_web import connect_to_db
from app.postgreSql.request.Request_PostgreSql import build_insert_query
from app.postgreSql.json_base_model.add_rows_model import AddRowsRequest

router = APIRouter()


@router.post("/admin/method/post/table/add_row")
def add_row(data: AddRowsRequest):
    """
    Ajoute une ou plusieurs lignes dans une table PostgreSQL
    en utilisant schema_name.
    """

    try:
        # Convertir le modèle en tuple compatible
        tuple_data = data.to_tuple()

        # Générer la requête SQL
        query = build_insert_query(tuple_data)

        # Connexion à la base
        conn = connect_to_db()
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