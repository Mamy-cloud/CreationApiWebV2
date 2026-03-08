from fastapi import APIRouter, HTTPException

from app.postgreSql.connexion_db.db_PostgreSql_web import connect_to_db
from app.postgreSql.request.Request_PostgreSql import update_row
from app.postgreSql.json_base_model.json_modify_value_row_model import ModifyValueRowRequest

router = APIRouter()


@router.put("/admin/method/put/modify/value/row/postgresql")
def modify_row(data: ModifyValueRowRequest):

    conn = None
    cur = None

    try:
        # connexion à la base
        conn = connect_to_db()
        cur = conn.cursor()

        # génération de la requête
        query = update_row(
            data.schema_name,
            data.table_name,
            data.row_id,
            data.column_updates
        )

        # exécution
        cur.execute(query)

        # validation
        conn.commit()

        return {
            "message": "Ligne modifiée avec succès",
            "query_executed": query
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