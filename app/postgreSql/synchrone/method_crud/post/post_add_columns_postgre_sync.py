from fastapi import APIRouter, HTTPException
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import request_post_add_columns_postgre_sync
from app.postgreSql.synchrone.json_base_model.method_crud.model_add_columns_postgre_sync import AddColumnsModelPostgreSync

router = APIRouter()


@router.post("/app/{schema_name}/{table_name}/method/post/add_column/postgre/synchrone")
def add_columns_endpoint_postgre_sync(
    schema_name: str,
    table_name: str,
    data: AddColumnsModelPostgreSync
):
    conn = None
    cursor = None

    try:
        conn = postgre_sync_connect_to_db()
        cursor = conn.cursor()

        columns_data = [col.model_dump() for col in data.columns]

        query = request_post_add_columns_postgre_sync(
            schema_name=schema_name,
            table_name=table_name,
            columns=columns_data
        )

        cursor.execute(query)
        conn.commit()

        return {
            "message": f"✅ Colonnes ajoutées avec succès à la table {table_name}"
        }

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()