from psycopg2 import sql
from datetime import datetime, timedelta

def request_create_db_key_api_if_not_exist(cur):
    schema = "key_api_schema"
    table = "key_api_table"

    # 🔹 Schéma et table cible relationnelle (login)
    login_schema = "login_schema_db_create_api"
    login_table = "login_table_db_create_api"

    # 🔹 Créer le schéma api_key
    cur.execute(
        sql.SQL("CREATE SCHEMA IF NOT EXISTS {}")
        .format(sql.Identifier(schema))
    )

    # 🔹 Créer la table API key (version sécurisée)
    cur.execute(
        sql.SQL("""
            CREATE TABLE IF NOT EXISTS {}.{} (
                id SERIAL PRIMARY KEY,
                api_key_hash TEXT NOT NULL UNIQUE,
                user_id INT NOT NULL UNIQUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 hours'),
                is_active BOOLEAN DEFAULT TRUE,

                CONSTRAINT fk_key_api_user
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

    # 🔹 Index pour performance
    cur.execute(
        sql.SQL("""
            CREATE INDEX IF NOT EXISTS idx_key_api_user_id
            ON {}.{} (user_id)
        """).format(
            sql.Identifier(schema),
            sql.Identifier(table)
        )
    )

    #------------------------insérer la clé api dans db au moment du login-----------------

def insert_api_key_in_db(user_id: int, api_key: str, cursor, conn, expires_at=None):
    """
    Supprime toutes les anciennes API keys de l'utilisateur et insère une nouvelle API key
    avec is_active=True et optional expires_at.
    """
    # 🔹 Supprimer les anciens api_key
    cursor.execute("""
        DELETE FROM key_api_schema.key_api_table
        WHERE user_id = %s
    """, (user_id,))

    # 🔹 Insérer le nouveau api_key
    cursor.execute("""
        INSERT INTO key_api_schema.key_api_table (user_id, api_key_hash, created_at, is_active, expires_at)
        VALUES (%s, %s, NOW(), TRUE, %s)
    """, (user_id, api_key, expires_at))

    # 🔹 Commit
    conn.commit()