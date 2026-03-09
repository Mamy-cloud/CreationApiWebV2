from fastapi import APIRouter, HTTPException
import psycopg2
from psycopg2 import sql
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.Request_PostgreSql import postgre_sync_request_create_table_sql
from app.postgreSql.synchrone.json_base_model.create_table_model_postgre_sync import CreateTableModelPostgreSync

router = APIRouter()


@router.post("/app/postgre/synchrone/method/post_create_table")
def create_table_endpoint_postgre_sync(request: CreateTableModelPostgreSync):
    """
    Endpoint POST pour créer une table PostgreSQL depuis un JSON, sans SQLAlchemy.
    """
    conn = None
    cur = None
    try:
        # 🔹 Générer le SQL de création de table
        sql_query = postgre_sync_request_create_table_sql(
            schema_name=request.schema_name,
            table_name=request.table_name,
            columns=[col.model_dump() for col in request.columns]
        )
        sql_query = sql_query.replace("CREATE TABLE", "CREATE TABLE IF NOT EXISTS")
        print("SQL généré :", sql_query)

        # 🔹 Connexion directe à PostgreSQL
        conn = postgre_sync_connect_to_db()
        cur = conn.cursor()

        # 🔹 Créer le schema si nécessaire
        cur.execute(
            sql.SQL("CREATE SCHEMA IF NOT EXISTS {}").format(
                sql.Identifier(request.schema_name)
            )
        )
        conn.commit()
        print(f"Schema '{request.schema_name}' vérifié/créé")

        # 🔹 Exécuter la création de table
        cur.execute(sql_query)
        conn.commit()
        print("Table créée avec succès")

        return {
            "status": "success",
            "sql": sql_query,
            "table_info": request.model_dump()
        }

    except Exception as e:
        if conn:
            conn.rollback()
        print("❌ Exception :", e)
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()