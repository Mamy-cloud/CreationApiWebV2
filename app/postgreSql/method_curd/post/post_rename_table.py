from fastapi import APIRouter, HTTPException
from app.postgreSql.connexion_db.db_PostgreSql_web import connect_to_db
from app.postgreSql.request.Request_PostgreSql import post_rename_table_sql
from app.postgreSql.json_base_model.rename_table_model import RenameTableRequest

router = APIRouter()


@router.post("/admin/method/post/rename_table/new_name")
def rename_table(data: RenameTableRequest):

    try:
        conn = connect_to_db()
        cursor = conn.cursor()

        query = post_rename_table_sql(
            data.schema_name,
            data.old_name,
            data.new_name
        )

        cursor.execute(query)
        conn.commit()

        cursor.close()
        conn.close()

        return {"message": "Table renommée avec succès"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))