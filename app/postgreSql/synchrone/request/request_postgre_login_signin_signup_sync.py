from psycopg2 import sql

#-----------------------creation auto db if not exist------------------------
def request_create_db_login_if_not_exist(cur):
    SCHEMA_NAME_POSTGRE_LOGIN = "login_schema_db_create_api"
    TABLE_NAME_POSTGRE_LOGIN = "login_table_db_create_api"

    query = sql.SQL("""
        DO $$
        BEGIN
            -- 🔹 Création du schéma si non existant
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.schemata
                WHERE schema_name = {schema}
            ) THEN
                EXECUTE format('CREATE SCHEMA %I', {schema});
            END IF;

            -- 🔹 Création de la table si non existante
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = {schema}
                AND table_name = {table}
            ) THEN
                EXECUTE format(
                    'CREATE TABLE %I.%I (
                        id SERIAL PRIMARY KEY,
                        username VARCHAR(50) UNIQUE NOT NULL,
                        password_hash TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT NOW()
                    )',
                    {schema}, {table}
                );
            END IF;
        END
        $$;
    """).format(
        schema=sql.Literal(SCHEMA_NAME_POSTGRE_LOGIN),
        table=sql.Literal(TABLE_NAME_POSTGRE_LOGIN)
    )

    cur.execute(query)

#---------------------------création log----------------------------------

from app.postgreSql.protection_secure.hash_password.protection_hash_password_log_postgre import hash_password

def request_create_user_log(cursor, row_data: dict) -> dict:
    """
    Crée un utilisateur dans la table login si inexistant.
    Utilise bcrypt pour hacher le mot de passe.
    Schema et table sont fixés à login_schema_db_create_api.login_table_db_create_api
    
    Args:
        cursor: curseur psycopg2 déjà ouvert
        row_data: dict avec 'username', 'password_hash', 'created_at'
    
    Returns:
        dict: résultat de l'opération
    """

    # 🔹 Extraire les données depuis le dict
    username = row_data.get("username")
    password_plain = row_data.get("password_hash")
    created_at = row_data.get("created_at") or None

    # Schema et table fixes
    schema = "login_schema_db_create_api"
    table = "login_table_db_create_api"

    # 🔍 1. Vérifier si l'utilisateur existe
    # Vérifie si l'utilisateur existe dans la table
    query_check = f"""
        SELECT 1
        FROM login_schema_db_create_api.login_table_db_create_api
        WHERE username = %s
        LIMIT 1;
    """

    cursor.execute(query_check, (username,))
    result = cursor.fetchone()  # récupère la première ligne ou None
    exists = bool(result)       # True si une ligne existe, False sinon

    print("Résultat vérification existant :", exists)
    if exists:
        print("utilisateur déjà existant, pas de création de log")
        return {"success": True, "message": f"Utilisateur existe, veuillez vous connectez"}
    # 🔐 2. Hacher le mot de passe
    try:
        password_hashed = hash_password(password_plain)
        print("Mot de passe hashé :", password_hashed)
    except Exception as e:
        print("Erreur lors du hashage :", e)
        raise

    # 📝 3. Requête INSERT
    query_insert = f"""
        INSERT INTO {schema}.{table} 
            (username, password_hash, created_at)
        VALUES (%s, %s, %s);
    """
    try:
        print("Exécution requête INSERT : ", query_insert)
        cursor.execute(query_insert, (username, password_hashed, created_at))
        print("Insertion réussie pour :", username)
        return {"success": False, "message": f"Utilisateur créé avec succès"}
    except Exception as e:
        print("Erreur requête insert :", e)
        raise

#---------------------verify log -------------------------------
# modification de request_verify_log_postgre_sync.py

from app.postgreSql.protection_secure.hash_password.protection_hash_password_log_postgre import verify_password

def request_verify_log_postgre_sync(cursor, username: str, password_hash: str) -> tuple[bool, str]:
    """
    Vérifie :
    1. Si l'utilisateur existe
    2. Si le mot de passe est correct (hashé ou en clair)

    Retourne :
    - success (bool)
    - message (str)
    """

    # 🔍 1. Vérifier si l'utilisateur existe et récupérer le password_hash stocké
    query = """
        SELECT password_hash
        FROM login_schema_db_create_api.login_table_db_create_api
        WHERE username = %s
    """
    print("sql de vérification : ", query)
    cursor.execute(query, (username,))
    result = cursor.fetchone()
    print("résultat de la vérification user depuis requête : ", result)
    print("result :", result)
    print("type :", type(result))
    if not result:
        return False, "Utilisateur inexistant, créez un utilisateur"

    stored_password_hash = result["password_hash"]

    # 🔐 2. Vérifier le mot de passe
    # Si le hash stocké ressemble à un hash bcrypt ($2b$ ou $2a$)
    if stored_password_hash.startswith("$2b$") or stored_password_hash.startswith("$2a$"):
        # hashé → utiliser verify_password
        print("lancement du module de vérification verify_password")
        if verify_password(password_hash, stored_password_hash):
            return True, "Connexion réussie"
        else:
            return False, "Mot de passe incorrect"
    else:
        # pas hashé → comparer directement
        if password_hash == stored_password_hash:
            return True, "Connexion réussie"
        else:
            return False, "Mot de passe incorrect"