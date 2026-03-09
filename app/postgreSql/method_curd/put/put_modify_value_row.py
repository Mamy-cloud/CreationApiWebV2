from fastapi import APIRouter, HTTPException
from psycopg2 import sql

from app.postgreSql.connexion_db.db_PostgreSql_web import connect_to_db
from app.postgreSql.request.Request_PostgreSql import update_row
from app.postgreSql.json_base_model.json_modify_value_row_model import ModifyValueRowRequest

router = APIRouter()

@router.put("/admin/method/put/modify/value/row/postgresql")
def modify_row(data: ModifyValueRowRequest):
    # debug
    print("debug data", data)
    print("debug dict", data.dict())

    conn = None
    cur = None

    try:
        # connexion à la base
        conn = connect_to_db()
        cur = conn.cursor()

        # génération de la requête
        query, values = update_row(
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