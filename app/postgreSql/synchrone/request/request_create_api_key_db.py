from psycopg2 import sql
from datetime import datetime, timedelta
import secrets
import hashlib

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
                api_key_hash TEXT NOT NULL,
                user_id INT NOT NULL UNIQUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 hours'),
                is_active BOOLEAN DEFAULT TRUE,
                activate_for_request_http BOOLEAN DEFAULT FALSE,

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

#-------------------------création de clé api lors du login mettre en paramètre user_id et api_key_hash----
def insert_api_key_if_not_exist(cur, conn, user_id: int, api_key_hash: str) -> bool:
    """
    Vérifie si une clé API existe pour l'utilisateur.
    - Si oui : retourne True et ne crée rien.
    - Si non : crée une nouvelle clé API et retourne False.
    
    activate_for_request_http reste FALSE car non utilisée pour les appels HTTP.
    """
    # 🔹 Étape 1 : vérifier si l'utilisateur a déjà une clé API
    cur.execute("""
        SELECT 1
        FROM key_api_schema.key_api_table
        WHERE user_id = %s
        LIMIT 1;
    """, (user_id,))
    
    exists = cur.fetchone()
    
    if exists:
        # Clé API existante → on ne crée rien
        return True
    
    # 🔹 Étape 2 : créer la clé API car elle n'existe pas
    cur.execute("""
        INSERT INTO key_api_schema.key_api_table
        (user_id, api_key_hash, created_at, expires_at, is_active, activate_for_request_http)
        VALUES (%s, %s, NOW(), NOW() + INTERVAL '10 hours', TRUE, FALSE);
    """, (user_id, api_key_hash))

    conn.commit()
    
    return False

#-----------------------------vérification des id dans login table pour la relation user_id avec key_api_table création de clé api si n'existe pas------------



def check_and_create_api_keys(cur, conn):
    """
    Vérifie tous les user_id dans login_table_db_create_api et key_api_table.
    Si un utilisateur n'a pas de clé API, crée une clé API pour lui.
    """

    login_schema = "login_schema_db_create_api"
    login_table = "login_table_db_create_api"

    key_schema = "key_api_schema"
    key_table = "key_api_table"

    # 🔹 1️⃣ Vérifier les utilisateurs et leur clé API
    cur.execute(
        sql.SQL("""
            SELECT u.id AS user_id, k.api_key_hash
            FROM {}.{} u
            LEFT JOIN {}.{} k
            ON u.id = k.user_id
        """).format(
            sql.Identifier(login_schema),
            sql.Identifier(login_table),
            sql.Identifier(key_schema),
            sql.Identifier(key_table)
        )
    )

    results = cur.fetchall()

    # 🔹 2️⃣ Créer une clé API pour les utilisateurs qui n'en ont pas
    for user_id, api_key_hash in results:
        if api_key_hash is None:
            new_api_key = hashlib.sha256(secrets.token_hex(32).encode('utf-8')).hexdigest()
            cur.execute(
                sql.SQL("""
                    INSERT INTO {}.{} (
                        api_key_hash,
                        user_id,
                        created_at,
                        expires_at,
                        is_active,
                        activate_for_request_http
                    )
                    VALUES (%s, %s, NOW(), NOW() + INTERVAL '10 hours', TRUE, FALSE)
                """).format(
                    sql.Identifier(key_schema),
                    sql.Identifier(key_table)
                ),
                (new_api_key, user_id)
            )

    conn.commit()
    print("Clés API créées pour les utilisateurs sans clé.")

#------------------------------mettre is_active false lorsque la clé api expire-------------
def turn_is_active_false(cur, conn):
    """
    Met is_active à FALSE pour toutes les clés API expirées.
    """
    cur.execute("""
        UPDATE key_api_schema.key_api_table
        SET is_active = FALSE
        WHERE expires_at <= NOW()
          AND is_active = TRUE
    """)

    conn.commit()

#------------------------vérifie l'user_id dans is_active = false et créé un nouveau clé api-----

def refresh_inactive_api_keys(cur, conn):
    """
    Pour chaque utilisateur dont is_active = FALSE, crée une nouvelle clé API hashée.
    """

    key_schema = "key_api_schema"
    key_table = "key_api_table"

    # 🔹 1️⃣ Récupérer tous les user_id dont is_active = FALSE
    cur.execute(
        sql.SQL("""
            SELECT user_id
            FROM {}.{}
            WHERE is_active = FALSE
        """).format(
            sql.Identifier(key_schema),
            sql.Identifier(key_table)
        )
    )

    inactive_users = cur.fetchall()

    # 🔹 2️⃣ Créer une nouvelle clé API pour chaque utilisateur inactif
    for (user_id,) in inactive_users:
        # Générer et hasher la nouvelle clé API en une seule ligne
        new_api_key_hash = hashlib.sha256(secrets.token_hex(32).encode('utf-8')).hexdigest()

        cur.execute(
            sql.SQL("""
                UPDATE {}.{}
                SET api_key_hash = %s,
                    created_at = NOW(),
                    expires_at = NOW() + INTERVAL '10 hours',
                    is_active = TRUE
                WHERE user_id = %s
            """).format(
                sql.Identifier(key_schema),
                sql.Identifier(key_table)
            ),
            (new_api_key_hash, user_id)
        )

    conn.commit()
    print(f"{len(inactive_users)} clés API ont été régénérées pour les utilisateurs inactifs.")

#------------------------supprimer toutes les clé api is_active = false-----------------

def delete_api_key(cur, conn):
    """
    Supprime toutes les clés API dont is_active = FALSE.
    """

    key_schema = "key_api_schema"
    key_table = "key_api_table"

    # 🔹 Requête pour supprimer toutes les clés inactives
    cur.execute(
        sql.SQL("""
            DELETE FROM {}.{}
            WHERE is_active = FALSE
        """).format(
            sql.Identifier(key_schema),
            sql.Identifier(key_table)
        )
    )

    conn.commit()
    print("Toutes les clés API inactives ont été supprimées.")
