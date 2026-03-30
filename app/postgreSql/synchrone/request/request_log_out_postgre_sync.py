from psycopg2 import sql
from datetime import datetime, timedelta

from psycopg2 import sql

def request_create_table_accesstoken_logout_if_not_exist(cur):
    schema = "logout_schema"
    table = "logout_table"

    # 🔹 Schéma et table cible (login)
    login_schema = "login_schema_db_create_api"
    login_table = "login_table_db_create_api"

    # 🔹 Créer le schéma logout
    cur.execute(
        sql.SQL("CREATE SCHEMA IF NOT EXISTS {}")
        .format(sql.Identifier(schema))
    )

    # 🔹 Créer la table avec relation et refresh_expires_at
    cur.execute(
        sql.SQL("""
            CREATE TABLE IF NOT EXISTS {}.{} (
                id SERIAL PRIMARY KEY,
                token TEXT NOT NULL UNIQUE,
                user_id INT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                refresh_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

                CONSTRAINT fk_user
                FOREIGN KEY (user_id)
                REFERENCES {}.{}(id)
                ON DELETE CASCADE
            )
        """).format(
            sql.Identifier(schema),
            sql.Identifier(table),
            sql.Identifier(login_schema),
            sql.Identifier(login_table)
        )
    )

#----------------------ajout access token dans le db-----------------------------
def request_insert_access_token_to_db(cur, token: str, user_id: int, expires_in_seconds: int = 900):
    """
    Insère un access_token dans la table logout_table
    """

    schema = "logout_schema"
    table = "logout_table"

    expires_at = datetime.utcnow() + timedelta(seconds=expires_in_seconds)

    query = sql.SQL("""
        INSERT INTO {}.{} (token, user_id, expires_at)
        VALUES (%s, %s, %s)
        ON CONFLICT (token) DO NOTHING
    """).format(
        sql.Identifier(schema),
        sql.Identifier(table)
    )

    cur.execute(query, (token, user_id, expires_at))

#------------------------mis à jour access token expiré----------------
# request_update_access_token_postgre.py

def update_access_token_in_db(user_id: int, access_token: str, cursor, conn, expires_at):
    """
    Supprime tous les anciens tokens pour l'utilisateur et insère le nouveau access token.
    """
    # 🔹 Supprimer les anciens tokens pour cet utilisateur
    cursor.execute("""
        DELETE FROM logout_schema.logout_table
        WHERE user_id = %s
    """, (user_id,))

    # 🔹 Insérer le nouveau token
    cursor.execute("""
        INSERT INTO logout_schema.logout_table (user_id, token, created_at, expires_at)
        VALUES (%s, %s, NOW(), %s)
    """, (user_id, access_token, expires_at))

    # 🔹 Commit
    conn.commit()

#------------------------------------supprime le token lors de la déconnexion--------------
from psycopg2 import sql

def request_delete_token_logout(user_id: int, cursor, conn):
    """
    Supprime tous les tokens associés à un user_id.
    Utilisé lors du logout pour invalider immédiatement l'accès.
    """
    query = sql.SQL("""
        DELETE FROM logout_schema.logout_table
        WHERE user_id = %s
    """)

    cursor.execute(query, (user_id,))
    conn.commit()