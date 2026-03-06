from fastapi import APIRouter, HTTPException
from app.postgreSql.connexion_db.db_PostgreSql_web import connect_to_db
from app.postgreSql.request.Request_PostgreSql import post_add_columns
from app.postgreSql.json_base_model.add_columns_model import AddColumnsRequest

router = APIRouter()


@router.post("/admin/methods/post/schema/table/add_column")
def add_columns(data: AddColumnsRequest):
    """
    Endpoint pour ajouter une ou plusieurs colonnes à une table PostgreSQL
    dans un schéma spécifique.
    """
    conn = None
    cursor = None

    try:
        # Connexion à la DB
        conn = connect_to_db()
        cursor = conn.cursor()

        print("verif cursor")

        # ⚠️ Pydantic v2 -> model_dump()
        columns_data = [col.model_dump() for col in data.columns]
        print("liste colonne", columns_data)

        # Génère la requête SQL sécurisée
        query = post_add_columns(
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