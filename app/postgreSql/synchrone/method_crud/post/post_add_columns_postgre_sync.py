from fastapi import APIRouter, HTTPException
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.Request_PostgreSql_Sync_Crud import request_post_add_columns_postgre_sync
from app.postgreSql.synchrone.json_base_model.model_add_columns_postgre_sync import AddColumnsModelPostgreSync

router = APIRouter()


@router.post("/admin/methods/post/schema/table/add_column")
def add_columns_endpoint_postgre_sync(data: AddColumnsModelPostgreSync):
    """
    Endpoint pour ajouter une ou plusieurs colonnes à une table PostgreSQL
    dans un schéma spécifique.
    """
    conn = None
    cursor = None

    try:
        # Connexion à la DB
        conn = postgre_sync_connect_to_db()
        cursor = conn.cursor()

        print("verif cursor")

        # ⚠️ Pydantic v2 -> model_dump()
        columns_data = [col.model_dump() for col in data.columns]
        print("liste colonne", columns_data)

        # Génère la requête SQL sécurisée
        query = request_post_add_columns_postgre_sync(
            schema_name=data.schema_name,
            table_name=data.table_name,
            columns=columns_data
        )
        print("sql créé:", query)

        # Exécute la requête
        cursor.execute(query)
        print("excécution du cursor")
        conn.commit()
        print("commit dans le db effectué")

        return {
            "message": f"✅ Colonnes ajoutées avec succès à la table {data.table_name}"
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