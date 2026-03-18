from fastapi import APIRouter, HTTPException
import psycopg2
from app.postgreSql.synchrone.json_base_model.model_rename_columns_postgre_sync import RenameColumnsModelPostgreSync
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import request_rename_columns_postgre_sync
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db

router = APIRouter()


@router.put("/app/{schema_name}/{table_name}/postgre/sync/method/put/rename/column")
def rename_columns_endpoint_postgre_sync(
    schema_name: str,
    table_name: str,
    data: RenameColumnsModelPostgreSync
):
    """
    Renomme plusieurs colonnes d'une table PostgreSQL
    """

    print("base model", data)

    try:
        # ✅ On passe directement la liste (plus de dict)
        queries = request_rename_columns_postgre_sync(
            schema_name=schema_name,
            table_name=table_name,
            rename_list=[col.model_dump() for col in data.columns]
        )

        print("sql créé:", queries)

        # Connexion DB
        conn = postgre_sync_connect_to_db()
        cursor = conn.cursor()

        # Exécution des requêtes
        for q in queries:
            cursor.execute(q)

        conn.commit()

        cursor.close()
        conn.close()

        return {
            "message": f"{len(queries)} colonne(s) renommée(s) avec succès",
            "renamed_columns": [
                {"old_name": col.old_name, "new_name": col.new_name}
                for col in data.columns
            ]
        }

    except psycopg2.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )