from fastapi import APIRouter, HTTPException
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db
from app.postgreSql.synchrone.request.request_postgre_login_signin_signup_sync import request_create_user_log
from app.postgreSql.synchrone.json_base_model.method_crud.model_add_row_postgre_sync import AddRowsModelPostgreSync
import psycopg2
from datetime import datetime

router = APIRouter()


@router.post("/create/user/log/postgre/sync")
def endpoint_create_user_log(data: AddRowsModelPostgreSync):
    """
    Endpoint pour créer un ou plusieurs utilisateurs dans PostgreSQL.
    Utilise bcrypt pour hacher le mot de passe.
    """
    print("JSON reçu de la base model :", data)

    try:
        # 🔹 Connexion à la DB
        conn = postgre_sync_connect_to_db()
        cursor = conn.cursor()
        print("Ouverture DB pour création de log")

        responses = []

        # 🔹 Parcourir toutes les lignes du modèle
        print("Commencement des requêtes pour vérifier et créer les logs :")
        for row in data.rows:
            # Si created_at est vide ou None, générer la date actuelle
            if not row.get("created_at"):
                row["created_at"] = datetime.utcnow().isoformat()

            # Appel de la fonction sécurisée de création utilisateur
            row_result = request_create_user_log(cursor, row_data=row)
            responses.append(row_result)

        print("Toutes les requêtes terminées")

        # 🔹 Commit et fermeture
        conn.commit()
        cursor.close()
        conn.close()

        return {"success": True, "results": responses}

    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur PostgreSQL: {str(e)}")

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")